import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Expense } from '@/lib/services';
import { AlertTriangle } from 'lucide-react';

interface DeleteDialogProps {
	open: boolean;
	expense: Expense | null;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export const DeleteDialog = ({
	open,
	expense,
	onOpenChange,
	onConfirm,
}: DeleteDialogProps) => {
	if (!expense) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-2">
						<div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
						<DialogTitle>Delete Expense</DialogTitle>
					</div>
					<DialogDescription>
						Are you sure you want to delete "{expense.title}"? This action
						cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
