import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
	Category,
	categoryAPI,
	Expense,
	expenseAPI,
	ExpenseInput,
} from '@/lib/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
	AlertTriangle,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Download,
	Edit,
	Filter,
	Package,
	Plus,
	Search,
	Trash2,
} from 'lucide-react';
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
	const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
	const [filters, setFilters] = useState({
		category: '',
		startDate: '',
		endDate: '',
		page: 1,
		limit: 10,
	});
	const [pagination, setPagination] = useState({
		total: 0,
		pages: 0,
		page: 1,
		limit: 10,
	});

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
			} = { page: filters.page, limit: filters.limit };
			if (filters.category) params.categoryId = parseInt(filters.category, 10);
			if (filters.startDate) params.startDate = filters.startDate;
			if (filters.endDate) params.endDate = filters.endDate;

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
		const headers = ['Title', 'Amount', 'Category', 'Date', 'Description'];
		const rows = filteredAndSortedExpenses.map(exp => [
			exp.title,
			exp.amount,
			exp.category.name,
			formatDate(exp.date),
			exp.description || '',
		]);

		const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
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

	const filteredAndSortedExpenses = expenses
		.filter(
			exp =>
				exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(exp.description &&
					exp.description.toLowerCase().includes(searchQuery.toLowerCase()))
		)
		.sort((a, b) => {
			const multiplier = sortOrder === 'asc' ? 1 : -1;
			if (sortBy === 'amount') {
				return (a.amount - b.amount) * multiplier;
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

	if (isLoading) {
		return (
			<div className="space-y-6 animate-in fade-in duration-500">
				<div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
				<div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
				<div className="space-y-3">
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className="h-24 bg-gray-200 rounded-lg animate-pulse"
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
						Expenses
					</h1>
					<p className="text-sm sm:text-base text-gray-600">
						Manage and track your expenses
					</p>
				</div>
				<div className="flex flex-wrap gap-2 w-full sm:w-auto">
					{selectedExpenses.length > 0 && (
						<Button
							variant="destructive"
							onClick={handleBulkDelete}
							size="sm"
							className="flex items-center gap-2 text-xs sm:text-sm"
						>
							<Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
							Delete ({selectedExpenses.length})
						</Button>
					)}
					<Button
						variant="outline"
						onClick={exportToCSV}
						disabled={filteredAndSortedExpenses.length === 0}
						size="sm"
						className="flex items-center gap-2 text-xs sm:text-sm"
					>
						<Download className="h-3 w-3 sm:h-4 sm:w-4" />
						Export
					</Button>
					<Button
						onClick={() => openModal()}
						size="sm"
						className="flex items-center gap-2 text-xs sm:text-sm"
					>
						<Plus className="h-3 w-3 sm:h-4 sm:w-4" />
						Add Expense
					</Button>
				</div>
			</div>

			{/* Search and Quick Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Search expenses by title or description..."
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 sm:flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setDateRange('today')}
								className="text-xs sm:text-sm"
							>
								Today
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setDateRange('week')}
								className="text-xs sm:text-sm"
							>
								Week
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setDateRange('month')}
								className="text-xs sm:text-sm"
							>
								Month
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setDateRange('lastMonth')}
								className="text-xs sm:text-sm"
							>
								Last Month
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setDateRange('year')}
								className="text-xs sm:text-sm col-span-2 sm:col-span-1"
							>
								Year
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Advanced Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Advanced Filters
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label>Category</Label>
							<Select
								value={filters.category || undefined}
								onValueChange={value =>
									setFilters({ ...filters, category: value, page: 1 })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="All Categories" />
								</SelectTrigger>
								<SelectContent>
									{categories.map(category => (
										<SelectItem key={category.id} value={category.id}>
											<span className="flex items-center gap-2">
												{category.icon && <span>{category.icon}</span>}
												{category.name}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Sort By</Label>
							<Select
								value={`${sortBy}-${sortOrder}`}
								onValueChange={value => {
									const [by, order] = value.split('-') as [
										'date' | 'amount',
										'asc' | 'desc',
									];
									setSortBy(by);
									setSortOrder(order);
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="date-desc">Date (Newest First)</SelectItem>
									<SelectItem value="date-asc">Date (Oldest First)</SelectItem>
									<SelectItem value="amount-desc">
										Amount (High to Low)
									</SelectItem>
									<SelectItem value="amount-asc">
										Amount (Low to High)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="startDate">
								<Calendar className="h-4 w-4 inline mr-1" />
								Start Date
							</Label>
							<Input
								id="startDate"
								type="date"
								value={filters.startDate}
								onChange={e =>
									setFilters({ ...filters, startDate: e.target.value, page: 1 })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="endDate">
								<Calendar className="h-4 w-4 inline mr-1" />
								End Date
							</Label>
							<Input
								id="endDate"
								type="date"
								value={filters.endDate}
								onChange={e =>
									setFilters({ ...filters, endDate: e.target.value, page: 1 })
								}
							/>
						</div>
					</div>
					{(filters.category || filters.startDate || filters.endDate) && (
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setFilters({
									category: '',
									startDate: '',
									endDate: '',
									page: 1,
									limit: 10,
								})
							}
						>
							Clear Filters
						</Button>
					)}
				</CardContent>
			</Card>

			{/* Expenses List */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span className="flex items-center gap-2">
							All Expenses
							{pagination.total > 0 && (
								<span className="text-sm text-gray-500">
									({pagination.total} total)
								</span>
							)}
						</span>
						{filteredAndSortedExpenses.length > 0 && (
							<Button
								variant="outline"
								size="sm"
								onClick={toggleSelectAll}
								className="hover:scale-105 transition-transform duration-200"
							>
								{selectedExpenses.length === filteredAndSortedExpenses.length
									? 'Deselect All'
									: 'Select All'}
							</Button>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center justify-center h-32">
							Loading...
						</div>
					) : filteredAndSortedExpenses.length === 0 ? (
						<div className="text-center py-16">
							<Package className="h-20 w-20 mx-auto text-gray-300 mb-4" />
							<h3 className="text-xl font-semibold text-gray-700 mb-2">
								No expenses found
							</h3>
							<p className="text-gray-500 mb-6">
								{searchQuery || filters.category || filters.startDate
									? 'Try adjusting your filters or search query'
									: 'Start tracking your expenses by adding your first entry'}
							</p>
							<Button
								onClick={() => openModal()}
								className="hover:scale-105 transition-transform duration-200"
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Your First Expense
							</Button>
						</div>
					) : (
						<>
							<div className="space-y-3">
								{filteredAndSortedExpenses.map((expense, index) => (
									<div
										key={expense.id}
										className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
										style={{
											animationDelay: `${index * 50}ms`,
											animationFillMode: 'backwards',
										}}
									>
										{/* Mobile Layout - Top Row */}
										<div className="flex items-start gap-3 flex-1 w-full">
											<input
												type="checkbox"
												checked={selectedExpenses.includes(expense.id)}
												onChange={() => toggleSelectExpense(expense.id)}
												className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
											/>
											<div
												className="w-1 h-12 sm:h-14 rounded-full flex-shrink-0"
												// style={{ backgroundColor: expense.category.color || '#3b82f6' }}
											/>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-base sm:text-lg truncate">
													{expense.title}
												</h3>
												<div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mt-1">
													<span
														className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
														style={{
															backgroundColor: expense.category.color
																? `${expense.category.color}20`
																: '#dbeafe',
															color: expense.category.color || '#1e40af',
														}}
													>
														{expense.category.icon && (
															<span className="mr-1">
																{expense.category.icon}
															</span>
														)}
														{expense.category.name}
													</span>
													<span className="hidden sm:inline">•</span>
													<span className="text-xs">
														{formatDate(expense.date)}
													</span>
												</div>
												{expense.description && (
													<p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
														{expense.description}
													</p>
												)}
											</div>
										</div>

										{/* Mobile Layout - Bottom Row / Desktop Right Side */}
										<div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pl-8 sm:pl-0">
											<div className="text-left sm:text-right">
												<p className="text-lg sm:text-xl font-bold whitespace-nowrap">
													{formatCurrency(expense.amount, expense.currency)}
												</p>
											</div>
											<div className="flex gap-1 sm:gap-2 flex-shrink-0">
												<Button
													variant="outline"
													size="sm"
													onClick={() => openModal(expense)}
													className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex items-center justify-center"
												>
													<Edit className="h-3 w-3 sm:h-4 sm:w-4" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => openDeleteDialog(expense)}
													className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
												>
													<Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>

							{/* Pagination */}
							{!searchQuery && !sortBy && pagination.pages > 1 && (
								<div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t">
									<div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
										Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
										{Math.min(
											pagination.page * pagination.limit,
											pagination.total
										)}{' '}
										of {pagination.total} expenses
									</div>
									<div className="flex gap-1 sm:gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setFilters({ ...filters, page: filters.page - 1 })
											}
											disabled={filters.page === 1}
											className="text-xs sm:text-sm"
										>
											<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
											<span className="hidden sm:inline">Previous</span>
										</Button>
										<div className="flex items-center gap-0.5 sm:gap-1">
											{Array.from({ length: pagination.pages }, (_, i) => i + 1)
												.filter(
													page =>
														page === 1 ||
														page === pagination.pages ||
														(page >= filters.page - 1 &&
															page <= filters.page + 1)
												)
												.map((page, index, array) => (
													<>
														{index > 0 && array[index - 1] !== page - 1 && (
															<span className="px-1 text-xs sm:px-2 sm:text-sm">
																...
															</span>
														)}
														<Button
															key={page}
															variant={
																filters.page === page ? 'default' : 'outline'
															}
															size="sm"
															onClick={() => setFilters({ ...filters, page })}
															className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-xs sm:text-sm"
														>
															{page}
														</Button>
													</>
												))}
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setFilters({ ...filters, page: filters.page + 1 })
											}
											disabled={filters.page === pagination.pages}
											className="text-xs sm:text-sm"
										>
											<span className="hidden sm:inline">Next</span>
											<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Modal */}
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

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-red-600">
							<AlertTriangle className="h-5 w-5" />
							Delete Expense
						</DialogTitle>
						<DialogDescription className="pt-2">
							Are you sure you want to delete{' '}
							<span className="font-semibold text-gray-900">
								"{expenseToDelete?.title}"
							</span>
							?
							<br />
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							onClick={() => {
								setDeleteDialogOpen(false);
								setExpenseToDelete(null);
							}}
							className="hover:scale-105 transition-transform duration-200"
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform duration-200"
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

// Expense Modal Component
interface ExpenseModalProps {
	expense: Expense | null;
	categories: Category[];
	onClose: () => void;
	onSuccess: () => void;
}

const ExpenseModal = ({
	expense,
	categories,
	onClose,
	onSuccess,
}: ExpenseModalProps) => {
	const { toast } = useToast();
	const [selectedCurrency, setSelectedCurrency] = useState(() => {
		return (
			expense?.currency || localStorage.getItem('preferredCurrency') || 'USD'
		);
	});
	const [formData, setFormData] = useState<ExpenseInput>({
		title: expense?.title || '',
		amount: expense?.amount || 0,
		currency: expense?.currency || selectedCurrency,
		categoryId: expense?.category
			? typeof expense.category === 'string'
				? expense.category
				: expense.category.id
			: '',
		description: expense?.description || '',
		date: expense?.date
			? expense.date.split('T')[0]
			: new Date().toISOString().split('T')[0],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	const currencies = [
		{ code: 'USD', symbol: '$', name: 'US Dollar' },
		{ code: 'EUR', symbol: '€', name: 'Euro' },
		{ code: 'GBP', symbol: '£', name: 'British Pound' },
		{ code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
		{ code: 'INR', symbol: '₹', name: 'Indian Rupee' },
		{ code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
		{ code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
		{ code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
		{ code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
		{ code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
	];

	const handleCurrencyChange = (currency: string) => {
		setSelectedCurrency(currency);
		setFormData({ ...formData, currency });
		localStorage.setItem('preferredCurrency', currency);
	};

	// Prevent background scroll when modal is open
	useEffect(() => {
		document.body.style.overflow = 'hidden';

		// Close modal on Escape key
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleEscape);

		return () => {
			document.body.style.overflow = 'unset';
			window.removeEventListener('keydown', handleEscape);
		};
	}, [onClose]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			if (expense) {
				await expenseAPI.update(expense.id, formData);
				toast({
					variant: 'success',
					title: '✓ Expense updated',
					description: `"${formData.title}" has been updated successfully.`,
				});
			} else {
				await expenseAPI.create(formData);
				toast({
					variant: 'success',
					title: '✓ Expense created',
					description: `"${formData.title}" has been added successfully.`,
				});
			}
			onSuccess();
		} catch (err: unknown) {
			const errorMessage =
				typeof err === 'object' &&
				err !== null &&
				'response' in err &&
				typeof err.response === 'object' &&
				err.response !== null &&
				'data' in err.response &&
				typeof err.response.data === 'object' &&
				err.response.data !== null &&
				'error' in err.response.data
					? String(err.response.data.error)
					: 'Failed to save expense';
			setError(errorMessage);
			toast({
				variant: 'destructive',
				title: '✗ Failed to save expense',
				description: errorMessage,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-[60] !m-0"
			onClick={handleBackdropClick}
			style={{ animation: 'fadeIn 0.15s ease-out' }}
		>
			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
			`}</style>
			<Card className="w-full max-w-md shadow-2xl m-0 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
				<CardHeader className="pb-4">
					<CardTitle>{expense ? 'Edit Expense' : 'Add Expense'}</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm animate-in slide-in-from-top-2 duration-300">
								{error}
							</div>
						)}
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={e =>
									setFormData({ ...formData, title: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="amount">Amount</Label>
							<div className="flex gap-2">
								<div className="flex-1">
									<Input
										id="amount"
										type="number"
										step="0.01"
										value={formData.amount}
										onChange={e =>
											setFormData({
												...formData,
												amount: parseFloat(e.target.value),
											})
										}
										required
									/>
								</div>
								<Select
									value={selectedCurrency}
									onValueChange={handleCurrencyChange}
								>
									<SelectTrigger className="w-[110px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="z-[70]">
										{currencies.map(curr => (
											<SelectItem key={curr.code} value={curr.code}>
												{curr.symbol} {curr.code}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>{' '}
						<div className="space-y-2">
							<Label htmlFor="category">Category</Label>
							<Select
								value={formData.categoryId}
								onValueChange={value =>
									setFormData({ ...formData, categoryId: value })
								}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent className="z-[70]">
									{categories.length === 0 ? (
										<div className="p-2 text-sm text-gray-500 text-center">
											No categories available
										</div>
									) : (
										categories.map(cat => (
											<SelectItem key={cat.id} value={cat.id}>
												{cat.icon && `${cat.icon} `}
												{cat.name}
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="date">Date</Label>
							<Input
								id="date"
								type="date"
								value={formData.date}
								onChange={e =>
									setFormData({ ...formData, date: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description (Optional)</Label>
							<Input
								id="description"
								value={formData.description}
								onChange={e =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>
						<div className="flex gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="flex-1 hover:scale-105 transition-transform duration-200"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 hover:scale-105 transition-transform duration-200 disabled:hover:scale-100"
							>
								{isSubmitting ? 'Saving...' : expense ? 'Update' : 'Create'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
