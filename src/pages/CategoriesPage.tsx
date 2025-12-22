import { useState, useEffect, useMemo } from 'react';
import {
	Plus,
	Search,
	Filter,
	ChevronLeft,
	ChevronRight,
	X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	CategoryCard,
	CategoryModal,
	CategoryDeleteDialog,
	CategoryDetailModal,
} from '@/components/categories';
import type { Category } from '@/lib/services';
import { useCategories, CategoriesData } from '@/hooks/useCategories';

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

	// Fetch categories with React Query
	const { data: categoriesData, isLoading: loading } = useCategories({
		page: currentPage,
		limit,
		search: searchQuery,
		sortBy,
		sortOrder,
	});

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

	const handleCreateCategory = () => {
		setSelectedCategory(null);
		setIsModalOpen(true);
	};

	const handleEditCategory = (category: Category) => {
		setIsDetailModalOpen(false); // Close detail modal if open
		// Small delay to ensure modal state updates properly
		setTimeout(() => {
			setSelectedCategory(category);
			setIsModalOpen(true);
		}, 50);
	};

	const handleDeleteCategory = (category: Category) => {
		setIsDetailModalOpen(false); // Close detail modal if open
		// Small delay to ensure modal state updates properly
		setTimeout(() => {
			setSelectedCategory(category);
			setIsDeleteDialogOpen(true);
		}, 50);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedCategory(null);
	};

	const handleModalSuccess = () => {
		// React Query will automatically refetch after mutation
		handleModalClose();
	};

	const handleDeleteDialogClose = () => {
		setIsDeleteDialogOpen(false);
		setSelectedCategory(null);
	};

	const handleDeleteSuccess = () => {
		// React Query will automatically refetch after mutation
		handleDeleteDialogClose();
	};

	const handleViewCategory = (category: Category) => {
		setSelectedCategory(category);
		setIsDetailModalOpen(true);
	};

	const handleDetailModalClose = () => {
		setIsDetailModalOpen(false);
		setSelectedCategory(null);
	};

	const handleLimitChange = (newLimit: number) => {
		localStorage.setItem('categoriesPerPage', newLimit.toString());
		setLimit(newLimit);
		setCurrentPage(1);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleClearSearch = () => {
		setSearchTerm('');
		setSearchQuery('');
		setCurrentPage(1);
	};

	const handleSortChange = (value: string) => {
		setSortBy(value);
		setCurrentPage(1);
	};

	const handleSortOrderChange = (value: string) => {
		setSortOrder(value as 'asc' | 'desc');
		setCurrentPage(1);
	};

	return (
		<div className="py-6 px-2 sm:px-6 md:container md:mx-auto lg:px-8 min-h-screen">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Categories
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Manage your expense categories
					</p>
				</div>
				<Button onClick={handleCreateCategory} className="w-full sm:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Add Category
				</Button>
			</div>

			{/* Search and Filters */}
			<Card
				className="animate-in fade-in slide-in-from-top-4 duration-300"
				style={{ animationDelay: '100ms' }}
			>
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
				<div className="mt-4 mb-4 animate-in fade-in duration-300">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{searchTerm && filteredCategories.length !== categories.length
							? `Showing ${filteredCategories.length} of ${categories.length} categories`
							: `Showing ${categories.length} of ${totalCount} categories`}
					</p>
				</div>
			)}

			{/* Loading State */}
			{loading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 animate-in fade-in duration-300">
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
						/>
					))}
				</div>
			)}

			{/* Categories Grid */}
			{!loading && filteredCategories && filteredCategories.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
					{filteredCategories.map((category: Category, index: number) => (
						<CategoryCard
							key={category.id}
							category={category}
							index={index}
							onClick={handleViewCategory}
						/>
					))}
				</div>
			)}

			{/* Empty State */}
			{!loading && (!filteredCategories || filteredCategories.length === 0) && (
				<div className="text-center py-12 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
						<Filter className="h-8 w-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
						{searchTerm ? 'No categories found' : 'No categories yet'}
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						{searchTerm
							? 'Try adjusting your search or filters'
							: 'Get started by creating your first category'}
					</p>
					{!searchTerm && (
						<Button onClick={handleCreateCategory}>
							<Plus className="h-4 w-4 mr-2" />
							Create Category
						</Button>
					)}
				</div>
			)}

			{/* Pagination */}
			{!loading && categories && categories.length > 0 && totalPages > 1 && (
				<div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
					<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
						<span>Items per page:</span>
						<Select
							value={limit.toString()}
							onValueChange={value => handleLimitChange(parseInt(value))}
						>
							<SelectTrigger className="h-8 w-[70px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="25">25</SelectItem>
								<SelectItem value="50">50</SelectItem>
								<SelectItem value="100">100</SelectItem>
							</SelectContent>
						</Select>
						<span className="hidden sm:inline">
							| Page {currentPage} of {totalPages} | Total: {totalCount}
						</span>
					</div>
					<div className="flex gap-2">
						<Button
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 1}
							variant="outline"
							size="sm"
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="hidden sm:inline ml-1">Previous</span>
						</Button>
						<Button
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={currentPage === totalPages}
							variant="outline"
							size="sm"
						>
							<span className="hidden sm:inline mr-1">Next</span>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Category Modal */}
			<CategoryModal
				isOpen={isModalOpen}
				category={selectedCategory}
				onClose={handleModalClose}
				onSuccess={handleModalSuccess}
			/>

			{/* Delete Dialog */}
			<CategoryDeleteDialog
				isOpen={isDeleteDialogOpen}
				category={selectedCategory}
				onClose={handleDeleteDialogClose}
				onSuccess={handleDeleteSuccess}
			/>

			{/* Detail Modal */}
			<CategoryDetailModal
				isOpen={isDetailModalOpen}
				category={selectedCategory}
				onClose={handleDetailModalClose}
				onEdit={handleEditCategory}
				onDelete={handleDeleteCategory}
			/>
		</div>
	);
}
