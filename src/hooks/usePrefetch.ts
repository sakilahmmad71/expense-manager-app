import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { expenseKeys } from './useExpenses';
import { categoryKeys } from './useCategories';
import { dashboardKeys } from './useDashboard';
import { expenseAPI, categoryAPI, dashboardAPI } from '@/lib/services';

export const usePrefetchData = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		// Prefetch dashboard data when app loads (for authenticated users)
		const prefetchDashboard = () => {
			queryClient.prefetchQuery({
				queryKey: dashboardKeys.summary(),
				queryFn: () => dashboardAPI.getSummary().then(res => res.data.summary),
				staleTime: 1000 * 60 * 5, // 5 minutes
			});
		};

		// Prefetch categories (commonly needed across the app)
		const prefetchCategories = () => {
			queryClient.prefetchQuery({
				queryKey: categoryKeys.list({ page: 1, limit: 100 }),
				queryFn: () =>
					categoryAPI.getAll({ page: 1, limit: 100 }).then(res => res.data),
				staleTime: 1000 * 60 * 10, // 10 minutes (categories change less frequently)
			});
		};

		// Prefetch recent expenses for faster expense page load
		const prefetchExpenses = () => {
			queryClient.prefetchQuery({
				queryKey: expenseKeys.list({ page: 1, limit: 20 }),
				queryFn: () =>
					expenseAPI.getAll({ page: 1, limit: 20 }).then(res => res.data),
				staleTime: 1000 * 60 * 2, // 2 minutes
			});
		};

		// Prefetch after a short delay to avoid blocking initial render
		const timeoutId = setTimeout(() => {
			if (localStorage.getItem('token')) {
				prefetchDashboard();
				prefetchCategories();
				prefetchExpenses();
			}
		}, 1000); // 1 second delay

		return () => clearTimeout(timeoutId);
	}, [queryClient]);
};

// Hook to prefetch data on hover (for navigation links)
export const usePrefetchOnHover = () => {
	const queryClient = useQueryClient();

	const prefetchDashboard = () => {
		queryClient.prefetchQuery({
			queryKey: dashboardKeys.summary(),
			queryFn: () => dashboardAPI.getSummary().then(res => res.data.summary),
		});
	};

	const prefetchExpenses = () => {
		queryClient.prefetchQuery({
			queryKey: expenseKeys.list({ page: 1, limit: 20 }),
			queryFn: () =>
				expenseAPI.getAll({ page: 1, limit: 20 }).then(res => res.data),
		});
	};

	const prefetchCategories = () => {
		queryClient.prefetchQuery({
			queryKey: categoryKeys.list({ page: 1, limit: 20 }),
			queryFn: () =>
				categoryAPI.getAll({ page: 1, limit: 20 }).then(res => res.data),
		});
	};

	return {
		prefetchDashboard,
		prefetchExpenses,
		prefetchCategories,
	};
};
