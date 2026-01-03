import api from '@lib/api';

export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	authProvider?: string;
	createdAt: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	name: string;
}

export interface Category {
	id: string;
	name: string;
	color?: string;
	icon?: string;
	createdAt: string;
	updatedAt: string;
	_count?: {
		expenses: number;
	};
}

export interface Expense {
	id: string;
	title: string;
	amount: number;
	currency: string;
	category: Category;
	description?: string;
	date: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ExpenseInput {
	title: string;
	amount: number;
	currency?: string;
	categoryId: string;
	description?: string;
	date?: string;
}

export interface CategoryInput {
	name: string;
	color?: string;
	icon?: string;
}

export interface DashboardSummary {
	totalAmount: number;
	totalCount: number;
	averageExpense: number;
	categoryBreakdown: Record<string, number>;
}

// Auth API
export const authAPI = {
	register: (data: RegisterData) => api.post('/auth/register', data),
	login: (data: LoginData) => api.post('/auth/login', data),
	getProfile: () => api.get('/auth/profile'),
	updateProfile: (data: { name?: string; avatar?: string }) =>
		api.put('/auth/profile', data),
	changePassword: (data: { currentPassword: string; newPassword: string }) =>
		api.post('/auth/change-password', data),
	forgotPassword: (data: { email: string }) =>
		api.post('/auth/forgot-password', data),
	resetPassword: (data: { token: string; newPassword: string }) =>
		api.post('/auth/reset-password', data),
};

// Expense API
export const expenseAPI = {
	getAll: (params?: {
		page?: number;
		limit?: number;
		category?: string;
		startDate?: string;
		endDate?: string;
		search?: string;
	}) => api.get('/expenses', { params }),
	getById: (id: string) => api.get(`/expenses/${id}`),
	create: (data: ExpenseInput) => api.post('/expenses', data),
	update: (id: string, data: Partial<ExpenseInput>) =>
		api.put(`/expenses/${id}`, data),
	delete: (id: string) => api.delete(`/expenses/${id}`),
};

// Category API
export const categoryAPI = {
	getAll: (params?: { page?: number; limit?: number }) =>
		api.get('/categories', { params }),
	getById: (id: string) => api.get(`/categories/${id}`),
	create: (data: { name: string; color?: string; icon?: string }) =>
		api.post('/categories', data),
	update: (
		id: string,
		data: { name?: string; color?: string; icon?: string }
	) => api.put(`/categories/${id}`, data),
	delete: (id: string) => api.delete(`/categories/${id}`),
};

// Dashboard API
export const dashboardAPI = {
	getSummary: (params?: { startDate?: string; endDate?: string }) =>
		api.get('/dashboard/summary', { params }),
	getCategoryAnalytics: (params?: { startDate?: string; endDate?: string }) =>
		api.get('/dashboard/category-analytics', { params }),
	getMonthlyTrends: (params?: { year?: number }) =>
		api.get('/dashboard/monthly-trends', { params }),
	getRecentExpenses: (params?: { limit?: number }) =>
		api.get('/dashboard/recent-expenses', { params }),
};
