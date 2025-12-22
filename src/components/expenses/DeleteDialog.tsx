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
	expenseCount?: number;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export const DeleteDialog = ({
	open,
	expense,
	expenseCount,
	onOpenChange,
	onConfirm,
}: DeleteDialogProps) => {
	const isBulkDelete = expenseCount !== undefined && expenseCount > 0;

	if (!expense && !isBulkDelete) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-2">
						<div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
						<DialogTitle>
							{isBulkDelete && expenseCount > 1
								? 'Delete Multiple Expenses'
								: 'Delete Expense'}
						</DialogTitle>
					</div>
					<DialogDescription>
						{isBulkDelete ? (
							<>
								Are you sure you want to delete{' '}
								<span className="font-semibold text-gray-900">
									{expenseCount} selected{' '}
									{expenseCount === 1 ? 'expense' : 'expenses'}
								</span>
								? This action cannot be undone.
							</>
						) : (
							<>
								Are you sure you want to delete{' '}
								<span className="font-semibold text-gray-900">
									"{expense?.title}"
								</span>
								? This action cannot be undone.
							</>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Delete {isBulkDelete && `(${expenseCount})`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
