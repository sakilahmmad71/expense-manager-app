import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import {
	BudgetCard,
	BudgetDrawer,
	BudgetDialog,
	BudgetDetailDrawer,
	BudgetDeleteDrawer,
} from '@/components/budgets';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Budget } from '@/lib/services';
import { Plus, Search, TrendingDown, Filter, X } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useBudgets, BudgetsData } from '@/hooks/useBudgets';
import { useCategories, CategoriesData } from '@/hooks/useCategories';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const BudgetCardSkeleton = () => (
	<Card className="p-5 space-y-4">
		<div className="flex items-center justify-between">
			<Skeleton className="h-5 w-32" />
			<Skeleton className="h-8 w-20 rounded-full" />
		</div>
		<div className="space-y-2">
			<Skeleton className="h-8 w-40" />
			<Skeleton className="h-2 w-full rounded-full" />
		</div>
		<div className="flex items-center justify-between">
			<Skeleton className="h-4 w-24" />
			<Skeleton className="h-4 w-24" />
		</div>
	</Card>
);

const EmptyState = ({
	icon: Icon,
	title,
	description,
	action,
	className = '',
}: {
	icon: React.ElementType;
	title: string;
	description: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
}) => (
	<Card className={`p-12 text-center ${className}`}>
		<div className="flex flex-col items-center justify-center space-y-4">
			<div className="rounded-full bg-gray-100 p-6">
				<Icon className="h-12 w-12 text-gray-400" />
			</div>
			<div className="space-y-2">
				<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
				<p className="text-sm text-gray-600 max-w-md">{description}</p>
			</div>
			{action && (
				<Button onClick={action.onClick} className="mt-4">
					<Plus className="h-4 w-4 mr-2" />
					{action.label}
				</Button>
			)}
		</div>
	</Card>
);

export function BudgetsPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState<string>('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [currentPage, setCurrentPage] = useState(1);
	const [limit] = useState(
		parseInt(localStorage.getItem('budgetsPerPage') || '20')
	);
	const [selectedPeriod, setSelectedPeriod] = useState<
		'monthly' | 'yearly' | 'all'
	>('all');
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear()
	);
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth() + 1
	);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);

	// Modal states
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
	const isDesktop = useMediaQuery('(min-width: 768px)');

	// Build filters for API
	const filters = useMemo(() => {
		const baseFilters: Record<string, unknown> = {
			page: currentPage,
			limit,
			sortBy,
			sortOrder,
		};

		if (selectedPeriod !== 'all') {
			baseFilters.period = selectedPeriod;
		}

		if (selectedYear) {
			baseFilters.year = selectedYear;
		}

		if (selectedPeriod === 'monthly' && selectedMonth) {
			baseFilters.month = selectedMonth;
		}

		if (selectedCategoryId) {
			baseFilters.categoryId = selectedCategoryId;
		}

		return baseFilters;
	}, [
		currentPage,
		limit,
		sortBy,
		sortOrder,
		selectedPeriod,
		selectedYear,
		selectedMonth,
		selectedCategoryId,
	]);

	// Fetch budgets with React Query
	const { data: budgetsData, isLoading: loading } = useBudgets(filters);

	// Fetch categories with React Query
	const { data: categoriesData } = useCategories({ page: 1, limit: 100 });

	// Extract data from queries with useMemo to avoid recreating on every render
	const budgets = useMemo(
		() => (budgetsData as BudgetsData | undefined)?.budgets || [],
		[budgetsData]
	);
	const totalPages = useMemo(
		() => (budgetsData as BudgetsData | undefined)?.pagination?.pages || 1,
		[budgetsData]
	);
	const totalCount = useMemo(
		() => (budgetsData as BudgetsData | undefined)?.pagination?.total || 0,
		[budgetsData]
	);
	const categories = useMemo(
		() => (categoriesData as CategoriesData | undefined)?.categories || [],
		[categoriesData]
	);

	// Set document title and meta description
	useEffect(() => {
		document.title = 'Budgets - Expenser | Manage Your Budgets';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'Create and manage budgets. Track your spending against budget limits and stay on track with your financial goals.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Create and manage budgets. Track your spending against budget limits and stay on track with your financial goals.';
			document.head.appendChild(meta);
		}
	}, []);

	// Client-side filtering for immediate feedback
	const filteredBudgets = useMemo(() => {
		if (!searchTerm) {
			return budgets;
		}

		return budgets.filter((budget: Budget) => {
			const searchLower = searchTerm.toLowerCase();
			return (
				budget.name?.toLowerCase().includes(searchLower) ||
				budget.notes?.toLowerCase().includes(searchLower) ||
				budget.categories?.some(bc =>
					bc.category.name.toLowerCase().includes(searchLower)
				)
			);
		});
	}, [budgets, searchTerm]);

	// Generate year options (last 5 years and next year)
	const yearOptions = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);
	}, []);

	// Generate month options
	const monthOptions = [
		{ value: 1, label: 'January' },
		{ value: 2, label: 'February' },
		{ value: 3, label: 'March' },
		{ value: 4, label: 'April' },
		{ value: 5, label: 'May' },
		{ value: 6, label: 'June' },
		{ value: 7, label: 'July' },
		{ value: 8, label: 'August' },
		{ value: 9, label: 'September' },
		{ value: 10, label: 'October' },
		{ value: 11, label: 'November' },
		{ value: 12, label: 'December' },
	];

	const handleCreateBudget = useCallback(() => {
		setSelectedBudget(null);
		setIsModalOpen(true);
	}, []);

	const handleEditBudget = useCallback((budget: Budget) => {
		setIsDetailModalOpen(false);
		setTimeout(() => {
			setSelectedBudget(budget);
			setIsModalOpen(true);
		}, 400);
	}, []);

	const handleDeleteBudget = useCallback((budget: Budget) => {
		setIsDetailModalOpen(false);
		setTimeout(() => {
			setSelectedBudget(budget);
			setIsDeleteDialogOpen(true);
		}, 300);
	}, []);

	const handleModalClose = useCallback(() => {
		setIsModalOpen(false);
		setSelectedBudget(null);
	}, []);

	const handleModalSuccess = useCallback(() => {
		handleModalClose();
	}, [handleModalClose]);

	const handleDeleteDialogClose = useCallback(() => {
		setIsDeleteDialogOpen(false);
		setSelectedBudget(null);
	}, []);

	const handleDeleteSuccess = useCallback(() => {
		handleDeleteDialogClose();
	}, [handleDeleteDialogClose]);

	const handleViewBudget = useCallback((budget: Budget) => {
		setSelectedBudget(budget);
		setIsDetailModalOpen(true);
	}, []);

	const handleDetailModalClose = useCallback(() => {
		setIsDetailModalOpen(false);
		setSelectedBudget(null);
	}, []);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
		},
		[]
	);

	const handleClearSearch = useCallback(() => {
		setSearchTerm('');
		setCurrentPage(1);
	}, []);

	const handleClearFilters = useCallback(() => {
		setSelectedPeriod('all');
		setSelectedYear(new Date().getFullYear());
		setSelectedMonth(new Date().getMonth() + 1);
		setSelectedCategoryId('');
		setSearchTerm('');
		setCurrentPage(1);
	}, []);

	const hasActiveFilters =
		selectedPeriod !== 'all' || selectedCategoryId !== '' || searchTerm !== '';

	return (
		<div className="py-6 px-2 sm:px-6 md:container md:mx-auto lg:px-8 min-h-screen animate-in fade-in duration-300">
			{/* Breadcrumb Navigation */}
			<PageBreadcrumb items={[{ label: 'Budgets' }]} />

			{/* Header */}
			<div
				id="budgets-header"
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 mt-6"
			>
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
						Budgets
					</h1>
					<p className="text-sm text-gray-600">
						Track and manage your spending limits
					</p>
				</div>
				<Button
					onClick={handleCreateBudget}
					className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-md"
				>
					<Plus className="h-4 w-4 mr-2" />
					Create Budget
				</Button>
			</div>

			{/* Search and Filters */}
			<Card id="budgets-filters">
				<div className="p-4 space-y-4">
					{/* Search Bar */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							type="text"
							placeholder="Search budgets by name, notes, or category..."
							value={searchTerm}
							onChange={handleSearchChange}
							className="pl-10 pr-10"
						/>
						{searchTerm && (
							<button
								onClick={handleClearSearch}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>

					{/* Filter Toggle Button */}
					<div className="flex items-center justify-between">
						<Button
							variant="outline"
							onClick={() => setIsFiltersOpen(!isFiltersOpen)}
							className="gap-2"
						>
							<Filter className="h-4 w-4" />
							Filters
							{hasActiveFilters && (
								<span className="ml-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
									Active
								</span>
							)}
						</Button>
						{hasActiveFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClearFilters}
								className="text-gray-600"
							>
								Clear all
							</Button>
						)}
					</div>

					{/* Collapsible Filters */}
					{isFiltersOpen && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-200">
							{/* Period Filter */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Period
								</label>
								<Select
									value={selectedPeriod}
									onValueChange={value =>
										setSelectedPeriod(value as 'monthly' | 'yearly' | 'all')
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select period" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Periods</SelectItem>
										<SelectItem value="monthly">Monthly</SelectItem>
										<SelectItem value="yearly">Yearly</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Year Filter */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Year
								</label>
								<Select
									value={selectedYear.toString()}
									onValueChange={value => setSelectedYear(parseInt(value))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select year" />
									</SelectTrigger>
									<SelectContent>
										{yearOptions.map(year => (
											<SelectItem key={year} value={year.toString()}>
												{year}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Month Filter (only for monthly period) */}
							{selectedPeriod === 'monthly' && (
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700">
										Month
									</label>
									<Select
										value={selectedMonth.toString()}
										onValueChange={value => setSelectedMonth(parseInt(value))}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select month" />
										</SelectTrigger>
										<SelectContent>
											{monthOptions.map(month => (
												<SelectItem
													key={month.value}
													value={month.value.toString()}
												>
													{month.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							{/* Category Filter */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Category
								</label>
								<Select
									value={selectedCategoryId}
									onValueChange={setSelectedCategoryId}
								>
									<SelectTrigger>
										<SelectValue placeholder="All categories" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">All Categories</SelectItem>
										{categories.map(category => (
											<SelectItem key={category.id} value={category.id}>
												{category.icon} {category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Sort Options */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Sort by
								</label>
								<Select value={sortBy} onValueChange={setSortBy}>
									<SelectTrigger>
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="createdAt">Date Created</SelectItem>
										<SelectItem value="updatedAt">Last Updated</SelectItem>
										<SelectItem value="amount">Amount</SelectItem>
										<SelectItem value="year">Year</SelectItem>
										<SelectItem value="month">Month</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Sort Order */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Order
								</label>
								<Select
									value={sortOrder}
									onValueChange={value => setSortOrder(value as 'asc' | 'desc')}
								>
									<SelectTrigger>
										<SelectValue placeholder="Order" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="desc">Descending</SelectItem>
										<SelectItem value="asc">Ascending</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					)}
				</div>
			</Card>

			{/* Results count */}
			{!loading && budgets && (
				<div className="mt-4 mb-4">
					<p className="text-sm text-gray-600">
						Showing{' '}
						<span className="font-semibold">{filteredBudgets.length}</span> of{' '}
						<span className="font-semibold">{totalCount}</span> budgets
					</p>
				</div>
			)}

			{/* Loading State */}
			{loading && !budgets.length && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
					{[...Array(6)].map((_, i) => (
						<BudgetCardSkeleton key={i} />
					))}
				</div>
			)}

			{/* Budgets Grid */}
			{!loading && filteredBudgets && filteredBudgets.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
					{filteredBudgets.map((budget, index) => (
						<BudgetCard
							key={budget.id}
							budget={budget}
							index={index}
							onClick={handleViewBudget}
						/>
					))}
				</div>
			)}

			{/* Empty State */}
			{!loading && (!filteredBudgets || filteredBudgets.length === 0) && (
				<EmptyState
					icon={searchTerm || hasActiveFilters ? Search : TrendingDown}
					title={
						searchTerm || hasActiveFilters
							? 'No budgets found'
							: 'No budgets yet'
					}
					description={
						searchTerm || hasActiveFilters
							? 'Try adjusting your search or filters'
							: 'Get started by creating your first budget to track spending'
					}
					action={
						!searchTerm && !hasActiveFilters
							? {
									label: 'Create Budget',
									onClick: handleCreateBudget,
								}
							: undefined
					}
					className="mt-6"
				/>
			)}

			{/* Pagination */}
			{!loading && budgets && budgets.length > 0 && totalPages > 1 && (
				<div className="mt-6 flex items-center justify-between">
					<p className="text-sm text-gray-600">
						Page {currentPage} of {totalPages}
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
							disabled={currentPage === 1}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
						>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* TODO: Add Budget Drawer/Dialog components */}
			{/* TODO: Add Budget Delete Drawer component */}
			{/* TODO: Add Budget Detail Drawer component */}

			{/* Budget Create/Edit Modal */}
			{isDesktop ? (
				<BudgetDrawer
					isOpen={isModalOpen}
					budget={selectedBudget}
					onClose={handleModalClose}
					onSuccess={handleModalSuccess}
				/>
			) : (
				<BudgetDialog
					isOpen={isModalOpen}
					budget={selectedBudget}
					onClose={handleModalClose}
					onSuccess={handleModalSuccess}
				/>
			)}

			{/* Budget Detail Drawer */}
			<BudgetDetailDrawer
				isOpen={isDetailModalOpen}
				budgetId={selectedBudget?.id || null}
				onClose={handleDetailModalClose}
				onEdit={handleEditBudget}
				onDelete={handleDeleteBudget}
			/>

			{/* Budget Delete Drawer */}
			<BudgetDeleteDrawer
				isOpen={isDeleteDialogOpen}
				budget={selectedBudget}
				onClose={handleDeleteDialogClose}
				onSuccess={handleDeleteSuccess}
			/>

			{/* Floating Action Button - Mobile Only */}
			<button
				onClick={handleCreateBudget}
				className="md:hidden fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
				aria-label="Create budget"
			>
				<Plus className="h-6 w-6" />
			</button>
		</div>
	);
}
