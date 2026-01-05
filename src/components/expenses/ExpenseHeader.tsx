import { Button } from '@/components/ui/button';
import { Download, Plus, Trash2 } from 'lucide-react';

interface ExpenseHeaderProps {
	selectedCount: number;
	onAddExpense: () => void;
	onExport: () => void;
	onBulkDelete: () => void;
}

export const ExpenseHeader = ({
	selectedCount,
	onAddExpense,
	onExport,
	onBulkDelete,
}: ExpenseHeaderProps) => {
	return (
		<div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
					<p className="text-muted-foreground mt-1">
						Track and manage your expenses
					</p>
				</div>
				<div className="flex-wrap gap-2 w-full sm:w-auto hidden md:flex">
					<Button
						variant="destructive"
						onClick={onBulkDelete}
						className="w-full sm:w-auto"
						disabled={selectedCount === 0}
					>
						<Trash2 className="h-4 w-4 mr-2" />
						Delete {selectedCount} Selected
					</Button>
					<Button
						variant="outline"
						onClick={onExport}
						className="flex-1 sm:flex-none "
					>
						<Download className="h-4 w-4 mr-2" />
						Export
					</Button>
					<Button onClick={onAddExpense} className="flex-1 sm:flex-none ">
						<Plus className="h-4 w-4 mr-2" />
						Add Expense
					</Button>
				</div>
			</div>
		</div>
	);
};
