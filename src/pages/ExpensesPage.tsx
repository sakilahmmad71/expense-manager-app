import {
	DeleteDialog,
	ExpenseFilters,
	ExpenseHeader,
	ExpenseList,
	ExpenseModal,
	ExpenseSearch,
} from '@/components/expenses';
import { ExpenseCardSkeleton } from '@/components/Skeletons';
import { useToast } from '@/components/ui/use-toast';
import { Expense } from '@/lib/services';
import { formatDate } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import {
	useExpenses,
	useDeleteExpense,
	useBulkDeleteExpenses,
	ExpensesData,
} from '@/hooks/useExpenses';
import { useCategories, CategoriesData } from '@/hooks/useCategories';

export const ExpensesPage = () => {
	const { toast } = useToast();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
	const [isBulkDeleteDialog, setIsBulkDeleteDialog] = useState(false);
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

	// Fetch expenses with React Query
	const { data: expensesData, isLoading: isLoadingExpenses } = useExpenses({
		...filters,
		sortBy,
		sortOrder,
	});

	// Fetch categories with React Query
	const { data: categoriesData } = useCategories({ page: 1, limit: 100 });

	// Extract data from queries with useMemo to avoid recreating on every render
	const expenses = useMemo(
		() => (expensesData as ExpensesData | undefined)?.expenses || [],
		[expensesData]
	);
	const pagination = useMemo(
		() =>
			(expensesData as ExpensesData | undefined)?.pagination || {
				total: 0,
				pages: 0,
				page: 1,
				limit: parseInt(localStorage.getItem('expensesPerPage') || '20'),
			},
		[expensesData]
	);
	const categories = useMemo(
		() => (categoriesData as CategoriesData | undefined)?.categories || [],
		[categoriesData]
	);

	// Mutations
	const deleteExpense = useDeleteExpense();
	const bulkDeleteExpenses = useBulkDeleteExpenses();

	// Set document title and meta description
	useEffect(() => {
		document.title = 'Expenses - Expenser | Manage Your Expenses';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'View, filter, and manage all your expenses. Sort by date, amount, or category. Export data and track spending patterns.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'View, filter, and manage all your expenses. Sort by date, amount, or category. Export data and track spending patterns.';
			document.head.appendChild(meta);
		}
	}, []);

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
	}, [searchQuery]);

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
	}, [monthFilter]);

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
		const escapeCSVField = (field: string | number) => {
			const str = String(field);
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

	// Memoized sorted expenses
	const filteredAndSortedExpenses = useMemo(() => {
		return [...expenses].sort((a, b) => {
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
	}, [expenses, sortBy, sortOrder]);

	// Calculate total of selected expenses
	const selectedExpensesTotal = useMemo(() => {
		if (selectedExpenses.length === 0) return 0;
		return filteredAndSortedExpenses
			.filter(exp => selectedExpenses.includes(exp.id))
			.reduce((sum, exp) => sum + exp.amount, 0);
	}, [selectedExpenses, filteredAndSortedExpenses]);

	// Get currency from the first selected expense
	const selectedCurrency = useMemo(() => {
		if (selectedExpenses.length === 0) return 'BDT';
		const firstSelectedExpense = filteredAndSortedExpenses.find(exp =>
			selectedExpenses.includes(exp.id)
		);
		return firstSelectedExpense?.currency || 'BDT';
	}, [selectedExpenses, filteredAndSortedExpenses]);

	// Currency symbol mapping
	const getCurrencySymbol = (currency: string) => {
		const symbols: Record<string, string> = {
			BDT: '৳',
			USD: '$',
			EUR: '€',
			GBP: '£',
			INR: '₹',
			JPY: '¥',
			CNY: '¥',
		};
		return symbols[currency] || currency;
	};

	const toggleSelectExpense = useCallback((id: string) => {
		setSelectedExpenses(prev =>
			prev.includes(id) ? prev.filter(expId => expId !== id) : [...prev, id]
		);
	}, []);

	const toggleSelectAll = useCallback(() => {
		if (selectedExpenses.length === filteredAndSortedExpenses.length) {
			setSelectedExpenses([]);
		} else {
			setSelectedExpenses(filteredAndSortedExpenses.map(exp => exp.id));
		}
	}, [selectedExpenses.length, filteredAndSortedExpenses]);

	const handleBulkDelete = useCallback(() => {
		if (selectedExpenses.length === 0) return;
		setIsBulkDeleteDialog(true);
		setDeleteDialogOpen(true);
	}, [selectedExpenses.length]);

	const confirmBulkDelete = () => {
		bulkDeleteExpenses.mutate(selectedExpenses, {
			onSuccess: () => {
				setSelectedExpenses([]);
				setDeleteDialogOpen(false);
				setIsBulkDeleteDialog(false);
			},
		});
	};

	const openDeleteDialog = (expense: Expense) => {
		setExpenseToDelete(expense);
		setDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		if (isBulkDeleteDialog) {
			confirmBulkDelete();
		} else if (expenseToDelete) {
			deleteExpense.mutate(expenseToDelete.id, {
				onSuccess: () => {
					setDeleteDialogOpen(false);
					setExpenseToDelete(null);
				},
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
		setSearchQuery('');
		setFilters({
			category: '',
			startDate: '',
			endDate: '',
			search: '',
			page: 1,
			limit: parseInt(localStorage.getItem('expensesPerPage') || '20'),
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
	};

	if (isLoadingExpenses) {
		return (
			<div className="py-6 px-2 sm:px-6 md:container md:mx-auto lg:px-8 min-h-screen animate-in fade-in duration-300">
				<div className="space-y-6">
					{/* Header Skeleton */}
					<div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
					{/* Filters Skeleton */}
					<div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
					{/* Stats Skeleton */}
					<div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
					{/* Expenses List Skeleton */}
					<div className="space-y-3">
						{[...Array(8)].map((_, i) => (
							<ExpenseCardSkeleton key={i} />
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="py-6 px-2 sm:px-6 md:container md:mx-auto lg:px-8 min-h-screen animate-in fade-in duration-300">
			<div className="space-y-6">
				<div id="expenses-header">
					<ExpenseHeader
						selectedCount={selectedExpenses.length}
						onAddExpense={() => openModal()}
						onExport={exportToCSV}
						onBulkDelete={handleBulkDelete}
					/>
				</div>

				<div id="expenses-filters">
					<ExpenseFilters
						isOpen={isFiltersOpen}
						categories={categories}
						monthOptions={monthOptions}
						filters={filters}
						monthFilter={monthFilter}
						sortBy={sortBy}
						sortOrder={sortOrder}
						onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
						onMonthFilterChange={setMonthFilter}
						onFiltersChange={setFilters}
						onSortChange={handleSortChange}
						onClearFilters={handleClearFilters}
						onDateRangeSelect={setDateRange}
					/>
				</div>

				<div id="expenses-search">
					<ExpenseSearch
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
					/>
				</div>

				<div id="expenses-list">
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
			</div>

			{/* Selected Expenses Total - Responsive Positioning */}
			{selectedExpenses.length > 0 && (
				<div
					className="fixed z-50 animate-in fade-in slide-in-from-bottom-4 duration-300
						top-4 left-1/2 -translate-x-1/2
						md:top-auto md:bottom-6"
				>
					<div className="bg-white text-gray-900 px-5 py-3 rounded-full shadow-lg border-2 border-gray-200">
						<div className="flex items-center gap-3">
							<span className="text-sm font-medium text-gray-700">
								{selectedExpenses.length}{' '}
								{selectedExpenses.length === 1 ? 'item' : 'items'} selected
							</span>
							<div className="h-4 w-px bg-gray-300" />
							<span className="text-base font-bold text-gray-900">
								{getCurrencySymbol(selectedCurrency)}
								{selectedExpensesTotal.toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</span>
						</div>
					</div>
				</div>
			)}

			{isModalOpen && (
				<ExpenseModal
					expense={editingExpense}
					categories={categories}
					onClose={closeModal}
					onSuccess={() => {
						closeModal();
					}}
				/>
			)}

			<DeleteDialog
				open={deleteDialogOpen}
				expense={expenseToDelete}
				expenseCount={isBulkDeleteDialog ? selectedExpenses.length : undefined}
				onOpenChange={open => {
					setDeleteDialogOpen(open);
					if (!open) {
						setIsBulkDeleteDialog(false);
						setExpenseToDelete(null);
					}
				}}
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
	);
};
