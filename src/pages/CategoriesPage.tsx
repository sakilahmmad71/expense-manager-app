import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { categoryAPI, Category } from '@/lib/services';
import { Plus, Edit, Trash2, Tag, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const CategoriesPage = () => {
	const { toast } = useToast();
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryPagination, setCategoryPagination] = useState({ total: 0, page: 1, pages: 0 });
	const [categorySearch, setCategorySearch] = useState('');
	const [categoriesPerPage] = useState(12);
	const [isLoading, setIsLoading] = useState(true);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

	const fetchCategories = async (page = 1) => {
		setIsLoading(true);
		try {
			const response = await categoryAPI.getAll({ page, limit: categoriesPerPage });
			setCategories(response.data.categories);
			setCategoryPagination(response.data.pagination);
		} catch (error) {
			console.error('Failed to fetch categories:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const filteredCategories = categories.filter((category) =>
		categorySearch ? category.name.toLowerCase().includes(categorySearch.toLowerCase()) : true
	);

	if (isLoading) {
		return (
			<div className='space-y-6 animate-in fade-in duration-500'>
				<div className='h-20 bg-gray-200 rounded-lg animate-pulse' />
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
					{[...Array(8)].map((_, i) => (
						<div key={i} className='h-32 bg-gray-200 rounded-lg animate-pulse' />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>Categories</h1>
					<p className='text-sm sm:text-base text-gray-600'>Manage your expense categories</p>
				</div>
				<Button
					onClick={() => {
						setEditingCategory(null);
						setIsCategoryModalOpen(true);
					}}
					size='sm'
					className='flex items-center gap-2 text-xs sm:text-sm'>
					<Plus className='h-3 w-3 sm:h-4 sm:w-4' />
					Add Category
				</Button>
			</div>

			{/* Search */}
			<Card>
				<CardContent className='p-4'>
					<Input
						type='text'
						placeholder='Search categories...'
						value={categorySearch}
						onChange={(e) => setCategorySearch(e.target.value)}
						className='max-w-md'
					/>
				</CardContent>
			</Card>

			{/* Categories Grid */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
						<Tag className='h-4 w-4 sm:h-5 sm:w-5' />
						All Categories
						{categoryPagination.total > 0 && (
							<span className='text-xs sm:text-sm text-gray-500'>
								({categoryPagination.total} total)
							</span>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredCategories.length === 0 ? (
						<div className='text-center py-8 sm:py-12'>
							<Tag className='h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-4' />
							<p className='text-sm sm:text-base text-gray-500 mb-4'>
								{categorySearch ? 'No categories match your search' : 'No categories found'}
							</p>
							<Button
								size='sm'
								onClick={() => {
									setEditingCategory(null);
									setIsCategoryModalOpen(true);
								}}
								className='text-xs sm:text-sm'>
								Create Your First Category
							</Button>
						</div>
					) : (
						<>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
								{filteredCategories.map((category, index) => (
									<div
										key={category.id}
										className='group relative p-4 sm:p-6 border-2 rounded-lg hover:shadow-md transition-shadow duration-200 animate-in fade-in slide-in-from-bottom-2'
										style={{
											borderColor: category.color || '#e5e7eb',
											animationDelay: `${index * 50}ms`,
											animationFillMode: 'backwards',
										}}>
										<div className='flex items-start justify-between gap-2'>
											<div className='flex-1 min-w-0'>
												<div className='flex items-center gap-2 mb-2'>
													{category.icon && (
														<span className='text-xl sm:text-2xl'>{category.icon}</span>
													)}
													<h3 className='font-semibold text-base sm:text-lg truncate'>
														{category.name}
													</h3>
												</div>
												{category.color && (
													<div className='flex items-center gap-2 text-xs text-gray-500'>
														<div
															className='w-3 h-3 sm:w-4 sm:h-4 rounded-full border'
															style={{ backgroundColor: category.color }}
														/>
														<span className='font-mono text-[10px] sm:text-xs'>
															{category.color}
														</span>
													</div>
												)}
											</div>
											<div className='flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => {
														setEditingCategory(category);
														setIsCategoryModalOpen(true);
													}}
													className='h-7 w-7 sm:h-8 sm:w-8 p-0'>
													<Edit className='h-3 w-3 sm:h-4 sm:w-4' />
												</Button>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => {
														setCategoryToDelete(category);
														setDeleteDialogOpen(true);
													}}
													className='h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700'>
													<Trash2 className='h-3 w-3 sm:h-4 sm:w-4' />
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>

							{/* Pagination */}
							{categoryPagination.pages > 1 && (
								<div className='flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t'>
									<div className='text-xs sm:text-sm text-gray-600 text-center sm:text-left'>
										Showing {(categoryPagination.page - 1) * categoriesPerPage + 1} to{' '}
										{Math.min(
											categoryPagination.page * categoriesPerPage,
											categoryPagination.total
										)}{' '}
										of {categoryPagination.total} categories
									</div>
									<div className='flex gap-1 sm:gap-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => fetchCategories(categoryPagination.page - 1)}
											disabled={categoryPagination.page === 1}
											className='text-xs sm:text-sm'>
											<span className='hidden sm:inline'>Previous</span>
											<span className='sm:hidden'>Prev</span>
										</Button>
										<div className='flex items-center gap-0.5 sm:gap-1'>
											{Array.from({ length: categoryPagination.pages }, (_, i) => i + 1)
												.filter(
													(page) =>
														page === 1 ||
														page === categoryPagination.pages ||
														(page >= categoryPagination.page - 1 &&
															page <= categoryPagination.page + 1)
												)
												.map((page, index, array) => (
													<>
														{index > 0 && array[index - 1] !== page - 1 && (
															<span className='px-1 text-xs sm:px-2 sm:text-sm text-gray-400'>
																...
															</span>
														)}
														<Button
															key={page}
															variant={categoryPagination.page === page ? 'default' : 'outline'}
															size='sm'
															onClick={() => fetchCategories(page)}
															className='h-8 w-8 sm:h-9 sm:w-9 p-0 text-xs sm:text-sm'>
															{page}
														</Button>
													</>
												))}
										</div>
										<Button
											variant='outline'
											size='sm'
											onClick={() => fetchCategories(categoryPagination.page + 1)}
											disabled={categoryPagination.page === categoryPagination.pages}
											className='hover:scale-105 transition-transform duration-200'>
											Next
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Category Modal */}
			{isCategoryModalOpen && (
				<CategoryModal
					category={editingCategory}
					onClose={() => {
						setIsCategoryModalOpen(false);
						setEditingCategory(null);
					}}
					onSuccess={() => {
						setIsCategoryModalOpen(false);
						setEditingCategory(null);
						fetchCategories(categoryPagination.page);
					}}
				/>
			)}

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='flex items-center gap-2 text-red-600'>
							<AlertTriangle className='h-5 w-5' />
							Delete Category
						</DialogTitle>
						<DialogDescription className='pt-2'>
							Are you sure you want to delete{' '}
							<span className='font-semibold text-gray-900'>"{categoryToDelete?.name}"</span>?
							<br />
							This action cannot be undone and will affect all expenses using this category.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='gap-2 sm:gap-0'>
						<Button
							variant='outline'
							onClick={() => {
								setDeleteDialogOpen(false);
								setCategoryToDelete(null);
							}}
							className='hover:scale-105 transition-transform duration-200'>
							Cancel
						</Button>
						<Button
							variant='destructive'
							onClick={async () => {
								if (!categoryToDelete) return;
								try {
									await categoryAPI.delete(categoryToDelete.id);
									toast({
										variant: 'success',
										title: '✓ Category deleted',
										description: `"${categoryToDelete.name}" has been deleted successfully.`,
									});
									fetchCategories(categoryPagination.page);
									setDeleteDialogOpen(false);
									setCategoryToDelete(null);
								} catch (error: any) {
									toast({
										variant: 'destructive',
										title: '✗ Failed to delete category',
										description: error.response?.data?.error || 'Please try again later.',
									});
								}
							}}
							className='bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform duration-200'>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

// Category Modal Component
interface CategoryModalProps {
	category: Category | null;
	onClose: () => void;
	onSuccess: () => void;
}

const CategoryModal = ({ category, onClose, onSuccess }: CategoryModalProps) => {
	const { toast } = useToast();
	const [formData, setFormData] = useState({
		name: category?.name || '',
		color: category?.color || '#3b82f6',
		icon: category?.icon || '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
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
			if (category) {
				await categoryAPI.update(category.id, formData);
				toast({
					variant: 'success',
					title: '✓ Category updated',
					description: `"${formData.name}" has been updated successfully.`,
				});
			} else {
				await categoryAPI.create(formData);
				toast({
					variant: 'success',
					title: '✓ Category created',
					description: `"${formData.name}" has been added successfully.`,
				});
			}
			onSuccess();
		} catch (err: any) {
			const errorMessage = err.response?.data?.error || 'Failed to save category';
			setError(errorMessage);
			toast({
				variant: 'destructive',
				title: '✗ Failed to save category',
				description: errorMessage,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

	const commonEmojis = ['🍔', '🚗', '🛒', '🎬', '💡', '🏥', '📱', '✈️', '🏠', '📚', '💼', '🎮'];

	return (
		<div
			className='fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-[60] !m-0'
			onClick={handleBackdropClick}
			style={{ animation: 'fadeIn 0.15s ease-out' }}>
			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
			`}</style>
			<Card className='w-full max-w-md shadow-2xl m-0 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200'>
				<CardHeader className='pb-4'>
					<CardTitle className='flex items-center justify-between'>
						<span>{category ? 'Edit Category' : 'Add Category'}</span>
						<Button variant='ghost' size='sm' onClick={onClose} className='h-8 w-8 p-0'>
							<X className='h-4 w-4' />
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent className='pt-0'>
					<form onSubmit={handleSubmit} className='space-y-4'>
						{error && (
							<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm animate-in slide-in-from-top-2 duration-300'>
								{error}
							</div>
						)}

						<div className='space-y-2'>
							<Label htmlFor='name'>Category Name</Label>
							<Input
								id='name'
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								placeholder='e.g. Food, Transport'
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='color'>Color</Label>
							<div className='flex gap-2'>
								<Input
									id='color'
									type='color'
									value={formData.color}
									onChange={(e) => setFormData({ ...formData, color: e.target.value })}
									className='w-20 h-10 cursor-pointer'
								/>
								<Input
									type='text'
									value={formData.color}
									onChange={(e) => setFormData({ ...formData, color: e.target.value })}
									placeholder='#3b82f6'
									className='flex-1'
								/>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='icon'>Icon (Emoji)</Label>
							<Input
								id='icon'
								value={formData.icon}
								onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
								placeholder='🍔'
								maxLength={2}
							/>
							<div className='flex flex-wrap gap-2 pt-2'>
								{commonEmojis.map((emoji) => (
									<button
										key={emoji}
										type='button'
										onClick={() => setFormData({ ...formData, icon: emoji })}
										className='text-2xl hover:scale-125 transition-transform p-1 hover:bg-gray-100 rounded'>
										{emoji}
									</button>
								))}
							</div>
						</div>

						<div className='flex gap-2 pt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={onClose}
								className='flex-1 hover:scale-105 transition-transform duration-200'>
								Cancel
							</Button>
							<Button
								type='submit'
								disabled={isSubmitting}
								className='flex-1 hover:scale-105 transition-transform duration-200 disabled:hover:scale-100'>
								{isSubmitting ? 'Saving...' : category ? 'Update' : 'Create'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
