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
import { Expense } from '@/lib/services';
import { AlertTriangle } from 'lucide-react';

interface ExpenseDeleteDrawerProps {
	open: boolean;
	expense: Expense | null;
	expenseCount?: number;
	onClose: () => void;
	onConfirm: () => void;
}

export const ExpenseDeleteDrawer = ({
	open,
	expense,
	expenseCount,
	onClose,
	onConfirm,
}: ExpenseDeleteDrawerProps) => {
	const isBulkDelete = expenseCount !== undefined && expenseCount > 0;

	// Keep local copy so close animation can run even if parent clears `expense`
	const [localExpense, setLocalExpense] = useState<Expense | null>(
		expense || null
	);

	useEffect(() => {
		if (open && expense) setLocalExpense(expense);
		if (!open) {
			const t = window.setTimeout(() => setLocalExpense(null), 300);
			return () => window.clearTimeout(t);
		}
	}, [open, expense]);

	if (!localExpense && !isBulkDelete && !open) return null;

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			onClose();
		}
	};

	return (
		<Drawer open={open} onOpenChange={handleOpenChange}>
			<DrawerContent className="sm:max-w-lg md:max-w-xl mx-auto">
				<DrawerHeader className="border-b">
					<div className="flex items-center gap-2">
						<div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
						<DrawerTitle className="text-red-600">
							{isBulkDelete && expenseCount > 1
								? 'Delete Multiple Expenses'
								: 'Delete Expense'}
						</DrawerTitle>
					</div>
					<DrawerDescription className="pt-2">
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
									"{localExpense?.title}"
								</span>
								? This action cannot be undone.
							</>
						)}
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="px-4 sm:px-6 pb-6">
					<div className="grid grid-cols-2 gap-4 w-full">
						{/* Delete Button - Left */}
						<Button
							variant="destructive"
							onClick={onConfirm}
							className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
						>
							Delete {isBulkDelete && `(${expenseCount})`}
						</Button>
						{/* Cancel Button - Right */}
						<Button
							variant="outline"
							onClick={onClose}
							className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 bg-white"
						>
							Cancel
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
