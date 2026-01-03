// Query key factories for consistent cache management
export const dashboardKeys = {
	all: ['dashboard'] as const,
	summary: (filters?: Record<string, unknown>) =>
		[...dashboardKeys.all, 'summary', filters] as const,
	recentExpenses: () => [...dashboardKeys.all, 'recentExpenses'] as const,
	monthlyTrends: () => [...dashboardKeys.all, 'monthlyTrends'] as const,
	categoryAnalytics: () => [...dashboardKeys.all, 'categoryAnalytics'] as const,
};

export const expenseKeys = {
	all: ['expenses'] as const,
	lists: () => [...expenseKeys.all, 'list'] as const,
	list: (filters: Record<string, unknown>) =>
		[...expenseKeys.lists(), filters] as const,
	details: () => [...expenseKeys.all, 'detail'] as const,
	detail: (id: string) => [...expenseKeys.details(), id] as const,
};

export const categoryKeys = {
	all: ['categories'] as const,
	lists: () => [...categoryKeys.all, 'list'] as const,
	list: (filters: Record<string, unknown>) =>
		[...categoryKeys.lists(), filters] as const,
	details: () => [...categoryKeys.all, 'detail'] as const,
	detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const userKeys = {
	all: ['user'] as const,
	profile: () => [...userKeys.all, 'profile'] as const,
};
