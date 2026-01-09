import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Filter, X, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { CategoryCardSkeleton } from '@/components/Skeletons';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ModernPagination } from '@/components/ui/modern-pagination';
import {
	CategoryCard,
	CategoryDrawer,
	CategoryDeleteDrawer,
	CategoryDetailDrawer,
} from '@/components/categories';
import type { Category, Expense } from '@/lib/services';
import { useCategories, CategoriesData } from '@/hooks/useCategories';
import { useExpenses } from '@/hooks/useExpenses';

export function CategoriesPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchQuery, setSearchQuery] = useState(''); // For debounced server search
	const [sortBy, setSortBy] = useState<string>('updatedAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(
		parseInt(localStorage.getItem('categoriesPerPage') || '20')
	);

	// Modal states
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);

	// Currency state
	const [primaryCurrency, setPrimaryCurrency] = useState('USD');

	// Fetch categories with React Query
	const { data: categoriesData, isLoading: loading } = useCategories({
		page: currentPage,
		limit,
		search: searchQuery,
		sortBy,
		sortOrder,
	});

	// Fetch expenses to detect primary currency
	const { data: expensesData } = useExpenses({ limit: 100 });

	// Extract data from queries with useMemo to avoid recreating on every render
	const categories = useMemo(
		() => (categoriesData as CategoriesData | undefined)?.categories || [],
		[categoriesData]
	);
	const totalPages = useMemo(
		() =>
			(categoriesData as CategoriesData | undefined)?.pagination?.pages || 1,
		[categoriesData]
	);
	const totalCount = useMemo(
		() =>
			(categoriesData as CategoriesData | undefined)?.pagination?.total || 0,
		[categoriesData]
	);

	// Set document title and meta description
	useEffect(() => {
		document.title = 'Categories - Expenser | Organize Your Expenses';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'Create and manage expense categories. Organize your spending with custom categories, icons, and colors.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Create and manage expense categories. Organize your spending with custom categories, icons, and colors.';
			document.head.appendChild(meta);
		}
	}, []);

	// Client-side filtering for immediate feedback
	const filteredCategories = useMemo(() => {
		if (!searchTerm) {
			return categories;
		}

		return categories.filter((category: Category) =>
			category.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [categories, searchTerm]);

	// Debounce search query to avoid excessive API calls
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchTerm !== searchQuery) {
				setSearchQuery(searchTerm);
				setCurrentPage(1); // Reset to first page on search
			}
		}, 500); // 500ms debounce

		return () => clearTimeout(timer);
	}, [searchTerm, searchQuery]);

	// Detect primary currency from expenses
	useEffect(() => {
		const expenses = (expensesData as { expenses?: Expense[] })?.expenses;
		if (!expenses || expenses.length === 0) return;

		const currencies = new Set(expenses.map((e: Expense) => e.currency));
		if (currencies.size > 0) {
			// Use the most common currency
			const currencyCount = expenses.reduce(
				(acc: Record<string, number>, e: Expense) => {
					acc[e.currency] = (acc[e.currency] || 0) + 1;
					return acc;
				},
				{}
			);
			const mostCommon = (
				Object.entries(currencyCount) as Array<[string, number]>
			).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0];
			setPrimaryCurrency(mostCommon ? String(mostCommon[0]) : 'USD');
		}
	}, [expensesData]);

	const handleCreateCategory = useCallback(() => {
		setSelectedCategory(null);
		setIsModalOpen(true);
	}, []);

	const handleEditCategory = useCallback((category: Category) => {
		// Close detail modal first, then open edit modal after animation
		setIsDetailModalOpen(false);
		setTimeout(() => {
			setSelectedCategory(category);
			setIsModalOpen(true);
		}, 400); // Vaul default animation is ~300ms, add buffer
	}, []);

	const handleDeleteCategory = useCallback((category: Category) => {
		// Close detail drawer first, then open delete drawer after animation
		setIsDetailModalOpen(false);
		setTimeout(() => {
			setSelectedCategory(category);
			setIsDeleteDialogOpen(true);
		}, 300); // Vaul default animation is ~300ms
	}, []);

	const handleModalClose = useCallback(() => {
		setIsModalOpen(false);
		setSelectedCategory(null);
	}, []);

	const handleModalSuccess = useCallback(() => {
		// React Query will automatically refetch after mutation
		handleModalClose();
	}, [handleModalClose]);

	const handleDeleteDialogClose = useCallback(() => {
		setIsDeleteDialogOpen(false);
		setSelectedCategory(null);
	}, []);

	const handleDeleteSuccess = useCallback(() => {
		// React Query will automatically refetch after mutation
		handleDeleteDialogClose();
	}, [handleDeleteDialogClose]);

	const handleViewCategory = useCallback((category: Category) => {
		setSelectedCategory(category);
		setIsDetailModalOpen(true);
	}, []);

	const handleDetailModalClose = useCallback(() => {
		setIsDetailModalOpen(false);
		setSelectedCategory(null);
	}, []);

	const handleLimitChange = useCallback((newLimit: number) => {
		localStorage.setItem('categoriesPerPage', newLimit.toString());
		setLimit(newLimit);
		setCurrentPage(1);
	}, []);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
		},
		[]
	);

	const handleClearSearch = useCallback(() => {
		setSearchTerm('');
		setSearchQuery('');
		setCurrentPage(1);
	}, []);

	const handleSortChange = useCallback((value: string) => {
		setSortBy(value);
		setCurrentPage(1);
	}, []);

	const handleSortOrderChange = useCallback((value: string) => {
		setSortOrder(value as 'asc' | 'desc');
		setCurrentPage(1);
	}, []);

	return (
		<div className="py-6 px-2 sm:px-6 md:container md:mx-auto lg:px-8 min-h-screen animate-in fade-in duration-300">
			{/* Breadcrumb Navigation */}
			<PageBreadcrumb items={[{ label: 'Categories' }]} />

			{/* Header */}
			<div
				id="categories-header"
				className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 mt-6"
			>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Categories</h1>
					<p className="text-muted-foreground mt-1">
						Manage your expense categories
					</p>
				</div>
				<Button onClick={handleCreateCategory} className="w-full sm:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Add Category
				</Button>
			</div>

			{/* Search and Filters */}
			<Card id="categories-filters">
				<CardContent className="p-3 sm:p-4">
					<div className="flex flex-col sm:flex-row gap-3">
						{/* Search Bar */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								type="text"
								placeholder="Search categories..."
								value={searchTerm}
								onChange={handleSearchChange}
								className="pl-10 pr-10 h-10 text-sm"
							/>
							{searchTerm && (
								<button
									onClick={handleClearSearch}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
									aria-label="Clear search"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>

						{/* Filters */}
						<div className="flex gap-2 items-center">
							<Filter className="h-4 w-4 text-gray-400" />
							<Select value={sortBy} onValueChange={handleSortChange}>
								<SelectTrigger className="w-[140px] sm:w-[160px] h-10">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name">Name</SelectItem>
									<SelectItem value="createdAt">Created Date</SelectItem>
									<SelectItem value="updatedAt">Updated Date</SelectItem>
								</SelectContent>
							</Select>

							<Select value={sortOrder} onValueChange={handleSortOrderChange}>
								<SelectTrigger className="w-[100px] sm:w-[120px] h-10">
									<SelectValue placeholder="Order" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="asc">Ascending</SelectItem>
									<SelectItem value="desc">Descending</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Results count */}
			{!loading && categories && (
				<div className="mt-4 mb-4">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{searchTerm && filteredCategories.length !== categories.length
							? `Showing ${filteredCategories.length} of ${categories.length} categories`
							: `Showing ${categories.length} of ${totalCount} categories`}
					</p>
				</div>
			)}

			{/* Loading State */}
			{loading && (
				<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-6">
					{[...Array(8)].map((_, i) => (
						<CategoryCardSkeleton key={i} />
					))}
				</div>
			)}

			{/* Categories Grid */}
			{!loading && filteredCategories && filteredCategories.length > 0 && (
				<div
					id="categories-grid"
					className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-6"
				>
					{filteredCategories.map((category: Category, index: number) => (
						<CategoryCard
							key={category.id}
							category={category}
							index={index}
							onClick={handleViewCategory}
							primaryCurrency={primaryCurrency}
						/>
					))}
				</div>
			)}

			{/* Empty State */}
			{!loading && (!filteredCategories || filteredCategories.length === 0) && (
				<EmptyState
					icon={searchTerm ? Search : Folder}
					title={searchTerm ? 'No categories found' : 'No categories yet'}
					description={
						searchTerm
							? 'Try adjusting your search or filters'
							: 'Get started by creating your first category'
					}
					action={
						!searchTerm
							? {
									label: 'Create Category',
									onClick: handleCreateCategory,
								}
							: undefined
					}
					className="mt-6"
				/>
			)}

			{/* Pagination */}
			{!loading && categories && categories.length > 0 && totalPages > 1 && (
				<div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
					<ModernPagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalCount}
						itemsPerPage={limit}
						onPageChange={setCurrentPage}
						onItemsPerPageChange={handleLimitChange}
						itemsPerPageOptions={[10, 20, 25, 50, 100]}
					/>
				</div>
			)}

			{/* Category Modal */}
			<CategoryDrawer
				isOpen={isModalOpen}
				category={selectedCategory}
				onClose={handleModalClose}
				onSuccess={handleModalSuccess}
			/>

			{/* Delete Dialog */}
			<CategoryDeleteDrawer
				isOpen={isDeleteDialogOpen}
				category={selectedCategory}
				onClose={handleDeleteDialogClose}
				onSuccess={handleDeleteSuccess}
			/>

			{/* Detail Drawer */}
			<CategoryDetailDrawer
				isOpen={isDetailModalOpen}
				category={selectedCategory}
				onClose={handleDetailModalClose}
				onEdit={handleEditCategory}
				onDelete={handleDeleteCategory}
			/>
		</div>
	);
}
