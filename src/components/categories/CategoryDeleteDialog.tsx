import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Category } from '@/lib/services';
import { useDeleteCategory } from '@/hooks/useCategories';
import { AlertTriangle } from 'lucide-react';

interface CategoryDeleteDialogProps {
	category: Category | null;
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export const CategoryDeleteDialog = ({
	category,
	isOpen,
	onClose,
	onSuccess,
}: CategoryDeleteDialogProps) => {
	const deleteCategory = useDeleteCategory();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!category || isDeleting) return;

		setIsDeleting(true);
		try {
			await deleteCategory.mutateAsync(category.id);
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

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-red-600">
						<AlertTriangle className="h-5 w-5" />
						Delete Category
					</DialogTitle>
					<DialogDescription className="pt-2">
						Are you sure you want to delete{' '}
						<span className="font-semibold text-gray-900">
							"{category?.name}"
						</span>
						?
						<br />
						This action cannot be undone and will affect all expenses using this
						category.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isDeleting}
						className="hover:scale-105 transition-transform duration-200"
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isDeleting}
						className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform duration-200"
					>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
