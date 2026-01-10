import { memo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Expense } from '@/lib/services';
import { formatCurrency, formatCurrencySymbol } from '@/lib/utils';

interface ExpenseCardProps {
	expense: Expense;
	isSelected: boolean;
	index: number;
	onSelect: (id: string) => void;
	onView: (expense: Expense) => void;
}

export const ExpenseCard = memo(
	({ expense, isSelected, index, onSelect, onView }: ExpenseCardProps) => {
		return (
			<div
				className="group relative bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2"
				style={{
					animationDelay: `${index * 50}ms`,
					animationFillMode: 'backwards',
				}}
			>
				{/* Content Container */}
				<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
					{/* Checkbox */}
					<Checkbox
						checked={isSelected}
						onCheckedChange={() => onSelect(expense.id)}
						className="flex-shrink-0"
					/>

					{/* Category Icon */}
					<div
						className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl"
						style={{
							backgroundColor: expense.category?.color
								? `${expense.category.color}20`
								: '#f3f4f6',
						}}
					>
						{expense.category?.icon || '📦'}
					</div>

					{/* Main Content */}
					<div
						className="flex-1 min-w-0 cursor-pointer"
						onClick={() => onView(expense)}
						title="Click to view details"
					>
						<h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
							{expense.title}
						</h3>
						<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-0.5">
							<span className="truncate">
								{expense.category?.name || 'Uncategorized'}
							</span>
						</div>
					</div>

					{/* Amount */}
					<div className="flex-shrink-0 text-right">
						{/* Desktop: Full currency format */}
						<p className="hidden sm:block text-lg font-bold text-gray-900">
							{formatCurrency(expense.amount, expense.currency)}
						</p>
						{/* Mobile: Symbol with amount */}
						<p className="sm:hidden text-base font-bold text-gray-900">
							{formatCurrencySymbol(expense.currency)}
							{expense.amount.toLocaleString('en-US', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
					</div>
				</div>
			</div>
		);
	}
);

ExpenseCard.displayName = 'ExpenseCard';
