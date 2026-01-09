import { categoryAPI, Category, CategoryInput } from '@/lib/services';
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

// Type for the cached categories data
export interface CategoriesData {
	categories: Category[];
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
export const categoryKeys = {
	all: ['categories'] as const,
	lists: () => [...categoryKeys.all, 'list'] as const,
	list: (filters: Record<string, unknown>) =>
		[...categoryKeys.lists(), filters] as const,
	details: () => [...categoryKeys.all, 'detail'] as const,
	detail: (id: string) => [...categoryKeys.details(), id] as const,
};

interface CategoryFilters extends Record<string, unknown> {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

/**
 * Hook to fetch paginated categories with filters
 */
export const useCategories = (
	filters: CategoryFilters = {},
	options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: categoryKeys.list(filters),
		queryFn: async () => {
			const response = await categoryAPI.getAll(filters);
			// Backend returns { categories: [...], pagination: {...}, _links: [...] }
			return response.data;
		},
		placeholderData: keepPreviousData,
		...options,
	});
};

/**
 * Hook to fetch a single category by ID
 */
export const useCategory = (
	id: string,
	options?: Omit<UseQueryOptions<Category, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: categoryKeys.detail(id),
		queryFn: async () => {
			const response = await categoryAPI.getById(id);
			return response.data.category;
		},
		enabled: !!id, // Only fetch if ID exists
		...options,
	});
};

/**
 * Hook to create a new category with optimistic updates
 */
export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (data: CategoryInput) => {
			const response = await categoryAPI.create(data);
			return response.data.category;
		},
		onMutate: async newCategory => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });

			// Snapshot previous value
			const previousCategories = queryClient.getQueriesData({
				queryKey: categoryKeys.lists(),
			});

			// Optimistically update to show new category immediately
			queryClient.setQueriesData(
				{ queryKey: categoryKeys.lists() },
				(old: unknown) => {
					const oldData = old as CategoriesData | undefined;
					if (!oldData) return old;
					return {
						...oldData,
						categories: [
							{
								...newCategory,
								id: 'temp-' + Date.now(),
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							} as Category,
							...oldData.categories,
						],
						pagination: {
							...oldData.pagination,
							total: oldData.pagination.total + 1,
						},
					};
				}
			);

			return { previousCategories };
		},
		onError: (error, _variables, context) => {
			// Rollback on error
			if (context?.previousCategories) {
				context.previousCategories.forEach(([queryKey, data]) => {
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
					title: '✗ Failed to create category',
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: () => {
			toast({
				title: '✓ Category created',
				description: 'Your category has been added successfully.',
			});
		},
		onSettled: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
};

/**
 * Hook to update an existing category with optimistic updates
 */
export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: Partial<CategoryInput>;
		}) => {
			const response = await categoryAPI.update(id, data);
			return response.data.category;
		},
		onMutate: async ({ id, data }) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: categoryKeys.detail(id) });
			await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });

			// Snapshot previous values
			const previousCategory = queryClient.getQueryData(
				categoryKeys.detail(id)
			);
			const previousCategories = queryClient.getQueriesData({
				queryKey: categoryKeys.lists(),
			});

			// Optimistically update detail
			queryClient.setQueryData(categoryKeys.detail(id), (old: unknown) => {
				const oldData = old as Category | undefined;
				if (!oldData) return old;
				return {
					...oldData,
					...data,
					updatedAt: new Date().toISOString(),
				};
			});
			// Optimistically update lists
			queryClient.setQueriesData(
				{ queryKey: categoryKeys.lists() },
				(old: unknown) => {
					const oldData = old as CategoriesData | undefined;
					if (!oldData) return old;
					return {
						...oldData,
						categories: oldData.categories.map((category: Category) =>
							category.id === id
								? { ...category, ...data, updatedAt: new Date().toISOString() }
								: category
						),
					};
				}
			);

			return { previousCategory, previousCategories };
		},
		onError: (error, { id }, context) => {
			// Rollback on error
			if (context?.previousCategory) {
				queryClient.setQueryData(
					categoryKeys.detail(id),
					context.previousCategory
				);
			}
			if (context?.previousCategories) {
				context.previousCategories.forEach(([queryKey, data]) => {
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
					title: '✗ Failed to update category',
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: () => {
			toast({
				title: '✓ Category updated',
				description: 'Your category has been updated successfully.',
			});
		},
		onSettled: (_data, _error, { id }) => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
			// Also invalidate expenses since they contain category references
			queryClient.invalidateQueries({ queryKey: ['expenses'] });
		},
	});
};

/**
 * Hook to delete a category with optimistic updates
 */
export const useDeleteCategory = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async ({
			id,
			reassignToCategoryId,
		}: {
			id: string;
			reassignToCategoryId?: string;
		}) => {
			const response = await categoryAPI.delete(id, reassignToCategoryId);
			return { id, ...response.data };
		},
		onMutate: async ({ id }) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });

			// Snapshot previous value
			const previousCategories = queryClient.getQueriesData({
				queryKey: categoryKeys.lists(),
			});

			// Optimistically remove category
			queryClient.setQueriesData(
				{ queryKey: categoryKeys.lists() },
				(old: unknown) => {
					const oldData = old as CategoriesData | undefined;
					if (!oldData) return old;
					return {
						...oldData,
						categories: oldData.categories.filter(
							(category: Category) => category.id !== id
						),
						pagination: {
							...oldData.pagination,
							total: Math.max(oldData.pagination.total - 1, 0),
						},
					};
				}
			);

			return { previousCategories };
		},
		onError: (error, _vars, context) => {
			// Rollback on error
			if (context?.previousCategories) {
				context.previousCategories.forEach(([queryKey, data]) => {
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
					title: '✗ Failed to delete category',
					description:
						axiosError.response?.data?.error || 'Something went wrong',
				});
			}
		},
		onSuccess: data => {
			const { reassignedExpenses } = data;
			if (reassignedExpenses && reassignedExpenses > 0) {
				toast({
					title: '✓ Category deleted',
					description: `Category deleted and ${reassignedExpenses} expense(s) reassigned successfully.`,
				});
			} else {
				toast({
					title: '✓ Category deleted',
					description: 'Your category has been deleted successfully.',
				});
			}
		},
		onSettled: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
			// Also invalidate expenses since they contain category references
			queryClient.invalidateQueries({ queryKey: ['expenses'] });
		},
	});
};
