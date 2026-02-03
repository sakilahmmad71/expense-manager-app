import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { Category } from '@/lib/services';
import { useDeleteCategory } from '@/hooks/useCategories';
import { AlertTriangle } from 'lucide-react';

interface CategoryDeleteDrawerProps {
	category: Category | null;
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export const CategoryDeleteDrawer = ({
	category,
	isOpen,
	onClose,
	onSuccess,
}: CategoryDeleteDrawerProps) => {
	const deleteCategory = useDeleteCategory();
	const [isDeleting, setIsDeleting] = useState(false);

	// Keep local copy so close animation can run even if parent clears `category`
	const [localCategory, setLocalCategory] = useState<Category | null>(
		category || null
	);

	useEffect(() => {
		if (isOpen && category) setLocalCategory(category);
		if (!isOpen) {
			const t = window.setTimeout(() => setLocalCategory(null), 300);
			return () => window.clearTimeout(t);
		}
	}, [isOpen, category]);

	const handleDelete = async () => {
		if (!localCategory || isDeleting) return;

		setIsDeleting(true);
		try {
			await deleteCategory.mutateAsync({ id: localCategory.id });
			// Close dialog after successful mutation
			onClose();
			onSuccess();
		} catch (_error: unknown) {
			// Error handling is done in the mutation hook
			// Only handle errors not covered by the hook
		} finally {
			setIsDeleting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	if (!localCategory && !isOpen) return null;

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="sm:max-w-lg md:max-w-xl mx-auto">
				<DrawerHeader className="border-b px-4 md:px-6 pt-3 md:pt-4 pb-2 md:pb-3">
					<DrawerTitle className="flex items-center gap-2 text-red-600 text-lg md:text-xl">
						<AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
						Delete Category
					</DrawerTitle>
					<DrawerDescription className="pt-2 text-xs md:text-sm">
						Are you sure you want to delete{' '}
						<span className="font-semibold text-gray-900">
							"{category?.name}"
						</span>
						?
						<br />
						This action cannot be undone and will affect all expenses using this
						category.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="px-4 md:px-6 pb-4 md:pb-6">
					<div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
						{/* Delete Button - Left */}
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting}
							className="w-full h-10 md:h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							{isDeleting ? 'Deleting...' : 'Delete'}
						</Button>
						{/* Cancel Button - Right */}
						<Button
							variant="outline"
							onClick={onClose}
							disabled={isDeleting}
							className="w-full h-10 md:h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							Cancel
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
