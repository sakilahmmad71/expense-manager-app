import { budgetAPI, Budget, BudgetInput } from '@/lib/services';
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
import { budgetKeys } from './queryKeys';
import { expenseKeys } from './queryKeys';
import { dashboardKeys } from './queryKeys';

// Type for the cached budgets data
export interface BudgetsData {
	budgets: Budget[];
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

interface BudgetFilters extends Record<string, unknown> {
	page?: number;
	limit?: number;
	period?: 'monthly' | 'yearly';
	year?: number;
	month?: number;
	categoryId?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

interface BudgetStatusFilters extends Record<string, unknown> {
	year?: number;
	month?: number;
	categoryId?: string;
}

/**
 * Hook to fetch paginated budgets with filters
 */
export const useBudgets = (
	filters: BudgetFilters = {},
	options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: budgetKeys.list(filters),
		queryFn: async () => {
			const response = await budgetAPI.getAll(filters);
			// Backend returns { budgets: [...], pagination: {...}, _links: [...] }
			return response.data;
		},
		placeholderData: keepPreviousData,
		staleTime: 0, // Mark as stale immediately to ensure fresh data after mutations
		...options,
	});
};

/**
 * Hook to fetch a single budget by ID
 */
export const useBudget = (
	id: string,
	options?: Omit<UseQueryOptions<Budget, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: budgetKeys.detail(id),
		queryFn: async () => {
			const response = await budgetAPI.getById(id);
			return response.data.budget;
		},
		enabled: !!id, // Only fetch if ID exists
		...options,
	});
};

/**
 * Hook to fetch budget status (spending vs budget)
 */
export const useBudgetStatus = (
	filters: BudgetStatusFilters = {},
	options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: budgetKeys.status(filters),
		queryFn: async () => {
			const response = await budgetAPI.getStatus(filters);
			return response.data;
		},
		placeholderData: keepPreviousData,
		staleTime: 0,
		...options,
	});
};

/**
 * Hook to create a new budget with optimistic updates
 */
export const useCreateBudget = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (data: BudgetInput) => {
			const response = await budgetAPI.create(data);
			return response.data.budget;
		},
		onMutate: async newBudget => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });

			// Snapshot previous value
			const previousBudgets = queryClient.getQueriesData({
				queryKey: budgetKeys.lists(),
			});

			// Optimistically update to show new budget immediately
			queryClient.setQueriesData(
				{ queryKey: budgetKeys.lists() },
				(old: unknown) => {
					const oldData = old as BudgetsData | undefined;
					if (!oldData) return old;
					return {
						...oldData,
						budgets: [
							{
								...newBudget,
								id: 'temp-' + Date.now(),
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
								userId: 'temp',
								alertAt80: newBudget.alertAt80 ?? true,
								alertAt100: newBudget.alertAt100 ?? true,
								currency: newBudget.currency || 'USD',
								period: newBudget.period || 'monthly',
								year: newBudget.year || new Date().getFullYear(),
							} as Budget,
							...oldData.budgets,
						],
						pagination: {
							...oldData.pagination,
							total: oldData.pagination.total + 1,
						},
					};
				}
			);

			return { previousBudgets };
		},
		onError: (error, _variables, context) => {
			// Rollback on error
			if (context?.previousBudgets) {
				context.previousBudgets.forEach(([queryKey, data]) => {
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
				toast.error('Failed to create budget', {
					description:
						axiosError.response?.data?.error || 'Please try again later.',
				});
			}
		},
		onSuccess: () => {
			toast.success('Budget created', {
				description: 'Your budget has been created successfully.',
			});
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: budgetKeys.all });
			queryClient.invalidateQueries({ queryKey: expenseKeys.all });
			queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
		},
	});
};

/**
 * Hook to update an existing budget
 */
export const useUpdateBudget = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: Partial<BudgetInput>;
		}) => {
			const response = await budgetAPI.update(id, data);
			return response.data.budget;
		},
		onMutate: async ({ id, data }) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });
			await queryClient.cancelQueries({ queryKey: budgetKeys.detail(id) });

			// Snapshot previous values
			const previousBudgets = queryClient.getQueriesData({
				queryKey: budgetKeys.lists(),
			});
			const previousBudget = queryClient.getQueryData(budgetKeys.detail(id));

			// Optimistically update the budget in the list
			queryClient.setQueriesData(
				{ queryKey: budgetKeys.lists() },
				(old: unknown) => {
					const oldData = old as BudgetsData | undefined;
					if (!oldData) return old;
					return {
						...oldData,
						budgets: oldData.budgets.map(budget =>
							budget.id === id
								? { ...budget, ...data, updatedAt: new Date().toISOString() }
								: budget
						),
					};
				}
			);

			// Optimistically update the detail view
			queryClient.setQueryData(budgetKeys.detail(id), (old: unknown) => {
				const oldBudget = old as Budget | undefined;
				if (!oldBudget) return old;
				return {
					...oldBudget,
					...data,
					updatedAt: new Date().toISOString(),
				};
			});

			return { previousBudgets, previousBudget };
		},
		onError: (error, _variables, context) => {
			// Rollback on error
			if (context?.previousBudgets) {
				context.previousBudgets.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}
			if (context?.previousBudget) {
				queryClient.setQueryData(
					budgetKeys.detail(_variables.id),
					context.previousBudget
				);
			}

			const axiosError = error as AxiosError<{ error: string }>;
			if (axiosError.response?.data?.error === 'Unauthorized') {
				toast.error('Session expired', {
					description: 'Please log in again.',
				});
				navigate('/login');
			} else {
				toast.error('Failed to update budget', {
					description:
						axiosError.response?.data?.error || 'Please try again later.',
				});
			}
		},
		onSuccess: () => {
			toast.success('Budget updated', {
				description: 'Your budget has been updated successfully.',
			});
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: budgetKeys.all });
			queryClient.invalidateQueries({ queryKey: expenseKeys.all });
			queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
		},
	});
};

/**
 * Hook to delete a budget
 */
export const useDeleteBudget = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (id: string) => {
			await budgetAPI.delete(id);
			return id;
		},
		onMutate: async id => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });

			// Snapshot previous value
			const previousBudgets = queryClient.getQueriesData({
				queryKey: budgetKeys.lists(),
			});

			// Optimistically remove the budget
			queryClient.setQueriesData(
				{ queryKey: budgetKeys.lists() },
				(old: unknown) => {
					const oldData = old as BudgetsData | undefined;
					if (!oldData) return old;
					return {
						...oldData,
						budgets: oldData.budgets.filter(budget => budget.id !== id),
						pagination: {
							...oldData.pagination,
							total: oldData.pagination.total - 1,
						},
					};
				}
			);

			return { previousBudgets };
		},
		onError: (error, _variables, context) => {
			// Rollback on error
			if (context?.previousBudgets) {
				context.previousBudgets.forEach(([queryKey, data]) => {
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
				toast.error('Failed to delete budget', {
					description:
						axiosError.response?.data?.error || 'Please try again later.',
				});
			}
		},
		onSuccess: () => {
			toast.success('Budget deleted', {
				description: 'Your budget has been deleted successfully.',
			});
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: budgetKeys.all });
			queryClient.invalidateQueries({ queryKey: expenseKeys.all });
			queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
		},
	});
};
