import { dashboardAPI } from '@/lib/services';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Query keys for better organization and type safety
export const dashboardKeys = {
	all: ['dashboard'] as const,
	summary: (filters?: Record<string, unknown>) =>
		[...dashboardKeys.all, 'summary', filters] as const,
	recentExpenses: (params?: Record<string, unknown>) =>
		[...dashboardKeys.all, 'recentExpenses', params] as const,
	monthlyTrends: () => [...dashboardKeys.all, 'monthlyTrends'] as const,
	categoryAnalytics: (filters?: Record<string, unknown>) =>
		[...dashboardKeys.all, 'categoryAnalytics', filters] as const,
};

interface DateFilters extends Record<string, unknown> {
	startDate?: string;
	endDate?: string;
}

interface RecentExpensesParams extends Record<string, unknown> {
	limit?: number;
}

/**
 * Hook to fetch dashboard summary with optional date filters
 */
export const useDashboardSummary = (
	filters?: DateFilters,
	options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: dashboardKeys.summary(filters),
		queryFn: async () => {
			const response = await dashboardAPI.getSummary(filters);
			return response.data.summary;
		},
		...options,
	});
};

/**
 * Hook to fetch recent expenses for dashboard
 */
export const useRecentExpenses = (
	params: RecentExpensesParams = { limit: 5 },
	options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: dashboardKeys.recentExpenses(params),
		queryFn: async () => {
			const response = await dashboardAPI.getRecentExpenses(params);
			return response.data.expenses;
		},
		...options,
	});
};

/**
 * Hook to fetch monthly trends data
 */
export const useMonthlyTrends = (
	options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: dashboardKeys.monthlyTrends(),
		queryFn: async () => {
			const response = await dashboardAPI.getMonthlyTrends();
			return response.data.trends;
		},
		...options,
	});
};

/**
 * Hook to fetch category analytics with optional date filters
 */
export const useCategoryAnalytics = (
	filters?: DateFilters,
	options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: dashboardKeys.categoryAnalytics(filters),
		queryFn: async () => {
			const response = await dashboardAPI.getCategoryAnalytics(filters);
			return response.data.categoryAnalytics;
		},
		...options,
	});
};

/**
 * Combined hook to fetch all dashboard data at once
 * Uses parallel queries for optimal performance
 */
export const useDashboard = (filters?: DateFilters) => {
	const summary = useDashboardSummary(filters);
	const recentExpenses = useRecentExpenses({ limit: 5 });
	const monthlyTrends = useMonthlyTrends();
	const categoryAnalytics = useCategoryAnalytics(filters);

	return {
		summary: summary.data,
		recentExpenses: recentExpenses.data,
		monthlyTrends: monthlyTrends.data,
		categoryAnalytics: categoryAnalytics.data,
		isLoading:
			summary.isLoading ||
			recentExpenses.isLoading ||
			monthlyTrends.isLoading ||
			categoryAnalytics.isLoading,
		isError:
			summary.isError ||
			recentExpenses.isError ||
			monthlyTrends.isError ||
			categoryAnalytics.isError,
		error:
			summary.error ||
			recentExpenses.error ||
			monthlyTrends.error ||
			categoryAnalytics.error,
		refetch: () => {
			summary.refetch();
			recentExpenses.refetch();
			monthlyTrends.refetch();
			categoryAnalytics.refetch();
		},
	};
};
