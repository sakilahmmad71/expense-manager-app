import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
} from '@/components/ui/drawer';
import { useDeleteBudget } from '@/hooks/useBudgets';
import { Budget } from '@/lib/services';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface BudgetDeleteDrawerProps {
	isOpen: boolean;
	budget: Budget | null;
	onClose: () => void;
	onSuccess: () => void;
}

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export const BudgetDeleteDrawer = ({
	isOpen,
	budget,
	onClose,
	onSuccess,
}: BudgetDeleteDrawerProps) => {
	const deleteBudget = useDeleteBudget();
	const [error, setError] = useState<string | null>(null);

	// Keep local copy for smooth animations
	const [localBudget, setLocalBudget] = useState<Budget | null>(budget || null);

	useEffect(() => {
		if (isOpen && budget) {
			setLocalBudget(budget);
		}
		if (!isOpen) {
			const t = window.setTimeout(() => setLocalBudget(null), 300);
			return () => window.clearTimeout(t);
		}
	}, [isOpen, budget]);

	const handleDelete = async () => {
		if (!localBudget) return;

		try {
			setError(null);
			await deleteBudget.mutateAsync(localBudget.id);
			onClose();
			onSuccess();
			toast.success('Budget deleted successfully');
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
					: 'Failed to delete budget';
			setError(errorMessage);
			toast.error('Failed to delete budget', {
				description: errorMessage,
			});
		}
	};

	const getPeriodDisplay = () => {
		if (!localBudget) return '';
		if (localBudget.period === 'monthly' && localBudget.month) {
			return `${months[localBudget.month - 1]} ${localBudget.year}`;
		}
		return localBudget.year.toString();
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="sm:max-w-lg md:max-w-xl mx-auto max-h-[95vh] overflow-hidden flex flex-col">
				<DrawerHeader className="border-b px-4 md:px-6 pt-3 md:pt-4 pb-2 md:pb-3">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-red-100">
							<AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
						</div>
						<div className="flex-1">
							<DrawerTitle className="text-xl md:text-2xl font-bold">
								Delete Budget
							</DrawerTitle>
							<DrawerDescription className="text-sm md:text-base">
								This action cannot be undone
							</DrawerDescription>
						</div>
					</div>
				</DrawerHeader>

				<div className="px-4 md:px-6 pb-4 md:pb-6 space-y-4">
					{localBudget && (
						<div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
							{localBudget.name && (
								<div>
									<p className="text-sm font-semibold">{localBudget.name}</p>
								</div>
							)}
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Amount</span>
								<span className="text-sm font-medium">
									{localBudget.currency} {localBudget.amount.toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Period</span>
								<span className="text-sm font-medium capitalize">
									{localBudget.period} - {getPeriodDisplay()}
								</span>
							</div>
							{localBudget.categories && localBudget.categories.length > 0 && (
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Categories
									</span>
									<span className="text-sm font-medium">
										{localBudget.categories.length} categories
									</span>
								</div>
							)}
						</div>
					)}

					<div className="p-4 bg-red-50 border border-red-200 rounded-xl">
						<p className="text-sm text-red-900">
							Are you sure you want to delete this budget? This action cannot be
							undone. The budget will be permanently removed from your account.
						</p>
					</div>

					{error && (
						<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					<div className="grid grid-cols-2 gap-3 md:gap-4 pt-2">
						<Button
							variant="outline"
							onClick={onClose}
							disabled={deleteBudget.isPending}
							className="w-full h-10 md:h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={deleteBudget.isPending}
							className="w-full h-10 md:h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							{deleteBudget.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Delete Budget
						</Button>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
