import { expenseAPI, Expense, ExpenseInput, Category } from '@/lib/services';
import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryOptions,
	keepPreviousData,
} from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { CategoriesData } from './useCategories';

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
	const { toast } = useToast();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (data: ExpenseInput) => {
			const response = await expenseAPI.create(data);
			return response.data.expense;
		},
		onMutate: async newExpense => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: expenseKeys.lists() });

			// Snapshot previous value
			const previousExpenses = queryClient.getQueriesData({
				queryKey: expenseKeys.lists(),
			});

			// Optimistically update to show new expense immediately
			queryClient.setQueriesData(
				{ queryKey: expenseKeys.lists() },
				(old: unknown) => {
					const oldData = old as ExpensesData | undefined;
					if (!oldData) return old;

					// Find the category for the new expense from category cache
					// Try to get from any category list query
					let category: Category | null = null;
					const categoryQueries = queryClient.getQueriesData<CategoriesData>({
						queryKey: ['categories', 'list'],
					});

					for (const [, data] of categoryQueries) {
						if (data?.categories) {
							const found = data.categories.find(
								(c: Category) => c.id === newExpense.categoryId
							);
							if (found) {
								category = found;
								break;
							}
						}
					}

					return {
						...oldData,
						expenses: [
							{
								...newExpense,
								id: 'temp-' + Date.now(),
								category: category,
								userId: 'temp-user',
								currency: newExpense.currency || 'USD',
								date: newExpense.date || new Date().toISOString(),
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							} as Expense,
							...oldData.expenses,
						],
						pagination: {
							...oldData.pagination,
							total: oldData.pagination.total + 1,
						},
					};
				}
			);

			return { previousExpenses };
		},
		onError: (error, _variables, context) => {
			// Rollback on error
			if (context?.previousExpenses) {
				context.previousExpenses.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}

			const axiosError = error as AxiosError<{ error: string }>;
			if (axiosError.response?.data?.error === 'Unauthorized') {
				toast({
					variant: 'destructive',
					title: '✗ Session expired',
					description: 'Please log in again.',
				});
				navigate('/login');
			} else {
				toast({
					variant: 'destructive',
					title: '✗ Failed to create expense',
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: () => {
			toast({
				title: '✓ Expense created',
				description: 'Your expense has been added successfully.',
			});
		},
		onSettled: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
};

/**
 * Hook to update an existing expense with optimistic updates
 */
export const useUpdateExpense = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
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
				toast({
					variant: 'destructive',
					title: '✗ Session expired',
					description: 'Please log in again.',
				});
				navigate('/login');
			} else {
				toast({
					variant: 'destructive',
					title: '✗ Failed to update expense',
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: () => {
			toast({
				title: '✓ Expense updated',
				description: 'Your expense has been updated successfully.',
			});
		},
		onSettled: (_data, _error, { id }) => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
};

/**
 * Hook to delete an expense with optimistic updates
 */
export const useDeleteExpense = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
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
				toast({
					variant: 'destructive',
					title: '✗ Session expired',
					description: 'Please log in again.',
				});
				navigate('/login');
			} else {
				toast({
					variant: 'destructive',
					title: '✗ Failed to delete expense',
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: () => {
			toast({
				title: '✓ Expense deleted',
				description: 'Your expense has been deleted successfully.',
			});
		},
		onSettled: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
};

/**
 * Hook to bulk delete expenses
 */
export const useBulkDeleteExpenses = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
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
				toast({
					variant: 'destructive',
					title: '✗ Session expired',
					description: 'Please log in again.',
				});
				navigate('/login');
			} else {
				toast({
					variant: 'destructive',
					title: '✗ Failed to delete expenses',
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: data => {
			const { deletedCount, requestedCount } = data;
			if (deletedCount === 0) {
				toast({
					variant: 'destructive',
					title: '⚠ No expenses deleted',
					description:
						'The selected expenses may not exist or do not belong to you.',
				});
			} else if (deletedCount < requestedCount) {
				toast({
					variant: 'default',
					title: '✓ Partially deleted',
					description: `${deletedCount} of ${requestedCount} expense(s) deleted. Some may not exist or belong to you.`,
				});
			} else {
				toast({
					title: '✓ Expenses deleted',
					description: `${deletedCount} expense(s) deleted successfully.`,
				});
			}
		},
		onSettled: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
};
