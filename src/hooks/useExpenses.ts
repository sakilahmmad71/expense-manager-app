import { expenseAPI, Expense, ExpenseInput } from '@/lib/services';
import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryOptions,
	keepPreviousData,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { dashboardKeys } from './useDashboard';

// Type for the cached expenses data
export interface ExpensesData {
	expenses: Expense[];
	pagination: {
		total: number;
		pages: number;
		page: number;
		limit: number;
	};
	_links?: Array<{
		rel: string;
		href: string;
		method?: string;
	}>;
}

// Query keys for better organization and type safety
export const expenseKeys = {
	all: ['expenses'] as const,
	lists: () => [...expenseKeys.all, 'list'] as const,
	list: (filters: Record<string, unknown>) =>
		[...expenseKeys.lists(), filters] as const,
	details: () => [...expenseKeys.all, 'detail'] as const,
	detail: (id: string) => [...expenseKeys.details(), id] as const,
};

interface ExpenseFilters extends Record<string, unknown> {
	page?: number;
	limit?: number;
	search?: string;
	category?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	startDate?: string;
	endDate?: string;
	minAmount?: number;
	maxAmount?: number;
}

/**
 * Hook to fetch paginated expenses with filters
 */
export const useExpenses = (
	filters: ExpenseFilters = {},
	options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: expenseKeys.list(filters),
		queryFn: async () => {
			const response = await expenseAPI.getAll(filters);
			// Backend returns { expenses: [...], pagination: {...}, _links: [...] }
			return response.data;
		},
		placeholderData: keepPreviousData,
		staleTime: 0, // Mark as stale immediately to ensure fresh data after mutations
		...options,
	});
};

/**
 * Hook to fetch a single expense by ID
 */
export const useExpense = (
	id: string,
	options?: Omit<UseQueryOptions<Expense, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: expenseKeys.detail(id),
		queryFn: async () => {
			const response = await expenseAPI.getById(id);
			return response.data.expense;
		},
		enabled: !!id, // Only fetch if ID exists
		...options,
	});
};

/**
 * Hook to create a new expense with optimistic updates
 */
export const useCreateExpense = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (data: ExpenseInput) => {
			const response = await expenseAPI.create(data);
			return response.data.expense;
		},
		onError: error => {
			const axiosError = error as AxiosError<{ error: string }>;
			if (axiosError.response?.data?.error === 'Unauthorized') {
				toast.error('Session expired', {
					description: 'Please log in again.',
				});
				navigate('/login');
			} else {
				toast.error('Failed to create expense', {
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: async () => {
			// Force refetch all expense list queries and wait for them to complete
			await queryClient.refetchQueries({
				queryKey: expenseKeys.lists(),
				type: 'active',
			});

			// Invalidate dashboard to update summary
			await queryClient.invalidateQueries({
				queryKey: dashboardKeys.all,
			});

			// Show success message
			toast.success('Expense created', {
				description: 'Your expense has been added successfully.',
			});
		},
	});
};

/**
 * Hook to update an existing expense with optimistic updates
 */
export const useUpdateExpense = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: Partial<ExpenseInput>;
		}) => {
			const response = await expenseAPI.update(id, data);
			return response.data.expense;
		},
		onMutate: async ({ id, data }) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: expenseKeys.detail(id) });
			await queryClient.cancelQueries({ queryKey: expenseKeys.lists() });

			// Snapshot previous values
			const previousExpense = queryClient.getQueryData(expenseKeys.detail(id));
			const previousExpenses = queryClient.getQueriesData({
				queryKey: expenseKeys.lists(),
			});

			// Optimistically update detail
			queryClient.setQueryData(expenseKeys.detail(id), (old: unknown) => {
				const oldData = old as Expense | undefined;
				if (!oldData) return old;
				return {
					...oldData,
					...data,
					updatedAt: new Date().toISOString(),
				};
			});

			// Optimistically update lists
			queryClient.setQueriesData(
				{ queryKey: expenseKeys.lists() },
				(old: unknown) => {
					const oldData = old as ExpensesData | undefined;
					if (!oldData) return old;
					return {
						...oldData,
						expenses: oldData.expenses.map((expense: Expense) =>
							expense.id === id
								? { ...expense, ...data, updatedAt: new Date().toISOString() }
								: expense
						),
					};
				}
			);

			return { previousExpense, previousExpenses };
		},
		onError: (error, { id }, context) => {
			// Rollback on error
			if (context?.previousExpense) {
				queryClient.setQueryData(
					expenseKeys.detail(id),
					context.previousExpense
				);
			}
			if (context?.previousExpenses) {
				context.previousExpenses.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}

			const axiosError = error as AxiosError<{ error: string }>;
			if (axiosError.response?.data?.error === 'Unauthorized') {
				toast.error('Session expired', {
					description: 'Please log in again.',
				});
				navigate('/login');
			} else {
				toast.error('Failed to update expense', {
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: async () => {
			// Force refetch all expense queries and wait for completion
			await queryClient.refetchQueries({
				queryKey: expenseKeys.lists(),
				type: 'active',
			});

			// Invalidate dashboard
			await queryClient.invalidateQueries({
				queryKey: dashboardKeys.all,
			});

			toast.success('Expense updated', {
				description: 'Your expense has been updated successfully.',
			});
		},
		onSettled: async (_data, _error, { id }) => {
			// Invalidate detail query for updated expense
			queryClient.invalidateQueries({
				queryKey: expenseKeys.detail(id),
			});
		},
	});
};

/**
 * Hook to delete an expense with optimistic updates
 */
export const useDeleteExpense = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (id: string) => {
			await expenseAPI.delete(id);
			return id;
		},
		onMutate: async id => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: expenseKeys.lists() });

			// Snapshot previous value
			const previousExpenses = queryClient.getQueriesData({
				queryKey: expenseKeys.lists(),
			});

			// Optimistically remove expense
			queryClient.setQueriesData(
				{ queryKey: expenseKeys.lists() },
				(old: unknown) => {
					const oldData = old as ExpensesData | undefined;
					if (!oldData) return old;
					return {
						...oldData,
						expenses: oldData.expenses.filter(
							(expense: Expense) => expense.id !== id
						),
						pagination: {
							...oldData.pagination,
							total: Math.max(oldData.pagination.total - 1, 0),
						},
					};
				}
			);

			return { previousExpenses };
		},
		onError: (error, _id, context) => {
			// Rollback on error
			if (context?.previousExpenses) {
				context.previousExpenses.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}

			const axiosError = error as AxiosError<{ error: string }>;
			if (axiosError.response?.data?.error === 'Unauthorized') {
				toast.error('Session expired', {
					description: 'Please log in again.',
				});
				navigate('/login');
			} else {
				toast.error('Failed to delete expense', {
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: async () => {
			// Force refetch all expense queries
			await queryClient.refetchQueries({
				queryKey: expenseKeys.lists(),
				type: 'active',
			});

			// Invalidate dashboard
			await queryClient.invalidateQueries({
				queryKey: dashboardKeys.all,
			});

			toast.success('Expense deleted', {
				description: 'Your expense has been deleted successfully.',
			});
		},
	});
};

/**
 * Hook to bulk delete expenses with optimistic updates
 */
export const useBulkDeleteExpenses = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (ids: string[]) => {
			const response = await expenseAPI.bulkDelete(ids);
			return response.data;
		},
		onMutate: async ids => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: expenseKeys.lists() });

			// Snapshot previous value
			const previousExpenses = queryClient.getQueriesData({
				queryKey: expenseKeys.lists(),
			});

			// Optimistically remove expenses
			queryClient.setQueriesData(
				{ queryKey: expenseKeys.lists() },
				(old: unknown) => {
					const oldData = old as ExpensesData | undefined;
					if (!oldData) return old;
					return {
						...oldData,
						expenses: oldData.expenses.filter(
							(expense: Expense) => !ids.includes(expense.id)
						),
						pagination: {
							...oldData.pagination,
							total: Math.max(oldData.pagination.total - ids.length, 0),
						},
					};
				}
			);

			return { previousExpenses };
		},
		onError: (error, _ids, context) => {
			// Rollback on error
			if (context?.previousExpenses) {
				context.previousExpenses.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}

			const axiosError = error as AxiosError<{ error: string }>;
			if (axiosError.response?.data?.error === 'Unauthorized') {
				toast.error('Session expired', {
					description: 'Please log in again.',
				});
				navigate('/login');
			} else {
				toast.error('Failed to delete expenses', {
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: async data => {
			// Force refetch all expense queries
			await queryClient.refetchQueries({
				queryKey: expenseKeys.lists(),
				type: 'active',
			});

			// Invalidate dashboard
			await queryClient.invalidateQueries({
				queryKey: dashboardKeys.all,
			});

			const { deletedCount, requestedCount } = data;
			if (deletedCount === 0) {
				toast.error('No expenses deleted', {
					description:
						'The selected expenses may not exist or do not belong to you.',
				});
			} else if (deletedCount < requestedCount) {
				toast.success('Partially deleted', {
					description: `${deletedCount} of ${requestedCount} expense(s) deleted. Some may not exist or belong to you.`,
				});
			} else {
				toast.success('Expenses deleted', {
					description: `${deletedCount} expense(s) deleted successfully.`,
				});
			}
		},
	});
};
