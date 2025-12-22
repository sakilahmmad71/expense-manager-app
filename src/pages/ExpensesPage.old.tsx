import {
	DeleteDialog,
	ExpenseFilters,
	ExpenseHeader,
	ExpenseList,
	ExpenseModal,
	ExpenseSearch,
} from '@/components/expenses';
import { useToast } from '@/components/ui/use-toast';
import { Category, categoryAPI, Expense, expenseAPI } from '@/lib/services';
import { formatDate } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ExpensesPage = () => {
	const { toast } = useToast();
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [filters, setFilters] = useState({
		category: '',
		startDate: '',
		endDate: '',
		search: '',
		page: 1,
		limit: parseInt(localStorage.getItem('expensesPerPage') || '20'),
	});
	const [monthFilter, setMonthFilter] = useState({
		startMonth: '',
		endMonth: '',
	});
	const [pagination, setPagination] = useState({
		total: 0,
		pages: 0,
		page: 1,
		limit: parseInt(localStorage.getItem('expensesPerPage') || '20'),
	});

	// Generate month options for the past 12 months and next month
	const generateMonthOptions = () => {
		const months = [];
		const today = new Date();

		for (let i = -12; i <= 1; i++) {
			const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
			const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			const label = date.toLocaleDateString('en-US', {
				month: 'long',
				year: 'numeric',
			});
			months.push({ value, label });
		}

		return months.reverse();
	};

	const monthOptions = generateMonthOptions();

	// Debounce search query to avoid excessive API calls
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchQuery !== filters.search) {
				setFilters(prev => ({
					...prev,
					search: searchQuery,
					page: 1, // Reset to first page on search
				}));
			}
		}, 500); // 500ms debounce

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQuery]); // Only re-run when searchQuery changes

	// Apply month filter to date filters when month range changes
	useEffect(() => {
		if (monthFilter.startMonth || monthFilter.endMonth) {
			let startDate = '';
			let endDate = '';

			// If only one month is selected, use it for both start and end (single month)
			if (monthFilter.startMonth && !monthFilter.endMonth) {
				// Single month - start selected
				const [year, month] = monthFilter.startMonth.split('-');
				startDate = `${monthFilter.startMonth}-01`;
				const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
				endDate = `${monthFilter.startMonth}-${String(lastDay).padStart(2, '0')}`;
			} else if (!monthFilter.startMonth && monthFilter.endMonth) {
				// Single month - end selected
				const [year, month] = monthFilter.endMonth.split('-');
				startDate = `${monthFilter.endMonth}-01`;
				const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
				endDate = `${monthFilter.endMonth}-${String(lastDay).padStart(2, '0')}`;
			} else if (monthFilter.startMonth && monthFilter.endMonth) {
				// Month range - both selected
				startDate = `${monthFilter.startMonth}-01`;
				const [endYear, endMonth] = monthFilter.endMonth.split('-');
				const lastDay = new Date(
					parseInt(endYear),
					parseInt(endMonth),
					0
				).getDate();
				endDate = `${monthFilter.endMonth}-${String(lastDay).padStart(2, '0')}`;
			}

			setFilters(prev => ({
				...prev,
				startDate,
				endDate,
				page: 1,
			}));
		}
		// Don't clear date filters when month filter is removed - allow manual date selection
	}, [monthFilter]);

	useEffect(() => {
		fetchExpenses();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	useEffect(() => {
		fetchCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchCategories = async () => {
		try {
			// Fetch all categories without pagination for the dropdown
			const response = await categoryAPI.getAll({ page: 1, limit: 100 });
			setCategories(response.data.categories);
		} catch (error) {
			console.error('Failed to fetch categories:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to load categories. Please refresh the page.',
			});
		}
	};

	const fetchExpenses = async () => {
		setIsLoading(true);
		try {
			const params: {
				page: number;
				limit: number;
				categoryId?: number;
				startDate?: string;
				endDate?: string;
				search?: string;
			} = { page: filters.page, limit: filters.limit };
			if (filters.category) params.categoryId = parseInt(filters.category, 10);
			if (filters.startDate) params.startDate = filters.startDate;
			if (filters.endDate) params.endDate = filters.endDate;
			if (filters.search) params.search = filters.search;

			const response = await expenseAPI.getAll(params);
			setExpenses(response.data.expenses);
			setPagination(response.data.pagination);
		} catch (error) {
			console.error('Failed to fetch expenses:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const setDateRange = (
		range: 'today' | 'week' | 'month' | 'lastMonth' | 'year'
	) => {
		const today = new Date();
		let startDate = new Date();
		let endDate = new Date();

		switch (range) {
			case 'today':
				startDate = today;
				break;
			case 'week':
				startDate.setDate(today.getDate() - 7);
				break;
			case 'month':
				startDate.setMonth(today.getMonth());
				startDate.setDate(1);
				break;
			case 'lastMonth':
				startDate.setMonth(today.getMonth() - 1);
				startDate.setDate(1);
				endDate = new Date(today.getFullYear(), today.getMonth(), 0);
				break;
			case 'year':
				startDate.setMonth(0);
				startDate.setDate(1);
				break;
		}

		setFilters({
			...filters,
			startDate: startDate.toISOString().split('T')[0],
			endDate: endDate.toISOString().split('T')[0],
			page: 1,
		});
	};

	const exportToCSV = () => {
		// Function to properly escape CSV fields
		const escapeCSVField = (field: string | number) => {
			const str = String(field);
			// If field contains comma, quote, or newline, wrap in quotes and escape quotes
			if (
				str.includes(',') ||
				str.includes('"') ||
				str.includes('\n') ||
				str.includes('\r')
			) {
				return `"${str.replace(/"/g, '""')}"`;
			}
			return str;
		};

		const headers = ['Title', 'Amount', 'Category', 'Date', 'Description'];
		const rows = filteredAndSortedExpenses.map(exp => [
			escapeCSVField(exp.title),
			escapeCSVField(exp.amount),
			escapeCSVField(exp.category.name),
			escapeCSVField(formatDate(exp.date)),
			escapeCSVField(exp.description || ''),
		]);

		const csv = [headers.map(h => escapeCSVField(h)), ...rows]
			.map(row => row.join(','))
			.join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();

		toast({
			variant: 'success',
			title: '✓ Expenses exported',
			description: 'Your expenses have been exported to CSV.',
		});
	};

	// Server handles search filtering, we only need to sort client-side
	const filteredAndSortedExpenses = expenses.sort((a, b) => {
		const multiplier = sortOrder === 'asc' ? 1 : -1;
		if (sortBy === 'amount') {
			return (a.amount - b.amount) * multiplier;
		} else if (sortBy === 'category') {
			return a.category.name.localeCompare(b.category.name) * multiplier;
		}
		return (
			(new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier
		);
	});

	const toggleSelectExpense = (id: string) => {
		setSelectedExpenses(prev =>
			prev.includes(id) ? prev.filter(expId => expId !== id) : [...prev, id]
		);
	};

	const toggleSelectAll = () => {
		if (selectedExpenses.length === filteredAndSortedExpenses.length) {
			setSelectedExpenses([]);
		} else {
			setSelectedExpenses(filteredAndSortedExpenses.map(exp => exp.id));
		}
	};

	const handleBulkDelete = async () => {
		if (selectedExpenses.length === 0) return;

		if (!confirm(`Delete ${selectedExpenses.length} selected expenses?`))
			return;

		try {
			await Promise.all(selectedExpenses.map(id => expenseAPI.delete(id)));
			setExpenses(expenses.filter(e => !selectedExpenses.includes(e.id)));
			setSelectedExpenses([]);
			toast({
				variant: 'success',
				title: '✓ Expenses deleted',
				description: `${selectedExpenses.length} expenses have been deleted successfully.`,
			});
		} catch (error) {
			console.error('Failed to delete expenses:', error);
			toast({
				variant: 'destructive',
				title: '✗ Failed to delete expenses',
				description: 'Please try again later.',
			});
		}
	};

	const openDeleteDialog = (expense: Expense) => {
		setExpenseToDelete(expense);
		setDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!expenseToDelete) return;

		try {
			await expenseAPI.delete(expenseToDelete.id);
			setExpenses(expenses.filter(e => e.id !== expenseToDelete.id));
			toast({
				variant: 'success',
				title: '✓ Expense deleted',
				description: `"${expenseToDelete.title}" has been deleted successfully.`,
			});
			setDeleteDialogOpen(false);
			setExpenseToDelete(null);
		} catch (error) {
			console.error('Failed to delete expense:', error);
			toast({
				variant: 'destructive',
				title: '✗ Failed to delete expense',
				description: 'Please try again later.',
			});
		}
	};

	const openModal = (expense?: Expense) => {
		setEditingExpense(expense || null);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setEditingExpense(null);
		setIsModalOpen(false);
	};

	const handleClearFilters = () => {
		setMonthFilter({ startMonth: '', endMonth: '' });
		setSearchQuery(''); // Clear search as well
		setFilters({
			category: '',
			startDate: '',
			endDate: '',
			search: '',
			page: 1,
			limit: 10,
		});
	};

	const handleSortChange = (
		by: 'date' | 'amount' | 'category',
		order: 'asc' | 'desc'
	) => {
		setSortBy(by);
		setSortOrder(order);
	};

	const handleLimitChange = (newLimit: number) => {
		localStorage.setItem('expensesPerPage', newLimit.toString());
		setFilters({ ...filters, limit: newLimit, page: 1 });
		setPagination({ ...pagination, limit: newLimit, page: 1 });
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
				<div className="space-y-6 animate-in fade-in duration-300">
					<div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
					<div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
					<div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
					<div className="space-y-3">
						{[...Array(5)].map((_, i) => (
							<div
								key={i}
								className="h-24 bg-gray-200 rounded-lg animate-pulse"
							/>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
			<div className="space-y-6">
				<div className="animate-in fade-in slide-in-from-top-4 duration-300">
					<ExpenseHeader
						selectedCount={selectedExpenses.length}
						onAddExpense={() => openModal()}
						onExport={exportToCSV}
						onBulkDelete={handleBulkDelete}
					/>
				</div>

				<div
					className="animate-in fade-in slide-in-from-top-4 duration-300"
					style={{ animationDelay: '100ms' }}
				>
					<ExpenseFilters
						monthFilter={monthFilter}
						filters={filters}
						categories={categories}
						monthOptions={monthOptions}
						sortBy={sortBy}
						sortOrder={sortOrder}
						isOpen={isFiltersOpen}
						onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
						onMonthFilterChange={setMonthFilter}
						onFiltersChange={setFilters}
						onSortChange={handleSortChange}
						onClearFilters={handleClearFilters}
						onDateRangeSelect={setDateRange}
					/>
				</div>

				<div
					className="animate-in fade-in slide-in-from-top-4 duration-300"
					style={{ animationDelay: '200ms' }}
				>
					<ExpenseSearch
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
					/>
				</div>

				<div
					className="animate-in fade-in slide-in-from-bottom-4 duration-500"
					style={{ animationDelay: '300ms' }}
				>
					<ExpenseList
						expenses={filteredAndSortedExpenses}
						selectedExpenses={selectedExpenses}
						pagination={pagination}
						onSelectExpense={toggleSelectExpense}
						onSelectAll={toggleSelectAll}
						onEdit={openModal}
						onDelete={openDeleteDialog}
						onPageChange={page => setFilters({ ...filters, page })}
						onLimitChange={handleLimitChange}
						onAddExpense={() => openModal()}
						onExport={exportToCSV}
						onBulkDelete={handleBulkDelete}
					/>
				</div>

				{isModalOpen && (
					<ExpenseModal
						expense={editingExpense}
						categories={categories}
						onClose={closeModal}
						onSuccess={() => {
							closeModal();
							fetchExpenses();
						}}
					/>
				)}

				<DeleteDialog
					open={deleteDialogOpen}
					expense={expenseToDelete}
					onOpenChange={setDeleteDialogOpen}
					onConfirm={handleDelete}
				/>

				{/* Floating Action Button - Mobile Only */}
				<button
					onClick={() => openModal()}
					className="md:hidden fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
					aria-label="Add expense"
				>
					<Plus className="h-6 w-6" />
				</button>
			</div>
		</div>
	);
};
