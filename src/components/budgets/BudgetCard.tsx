import { Budget } from '@/lib/services';
import { formatCurrency, formatCurrencySymbol } from '@/lib/utils';
import { TrendingUp, AlertCircle, Calendar, Tag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useMemo } from 'react';

interface BudgetCardProps {
	budget: Budget;
	index: number;
	onClick?: (budget: Budget) => void;
}

export const BudgetCard = ({ budget, index, onClick }: BudgetCardProps) => {
	// Calculate percentage and determine status
	const percentage = budget.percentage || 0;
	const spent = budget.spent || 0;
	const remaining = budget.remaining || budget.amount - spent;

	// Determine status color based on percentage
	const getStatusColor = () => {
		if (percentage >= 100) return 'text-red-600';
		if (percentage >= 80) return 'text-orange-600';
		return 'text-green-600';
	};

	const getProgressColor = () => {
		if (percentage >= 100) return 'bg-red-500';
		if (percentage >= 80) return 'bg-orange-500';
		return 'bg-green-500';
	};

	const getBgColor = () => {
		if (percentage >= 100) return 'bg-red-50';
		if (percentage >= 80) return 'bg-orange-50';
		return 'bg-white';
	};

	const getBorderColor = () => {
		if (percentage >= 100) return 'border-red-200';
		if (percentage >= 80) return 'border-orange-200';
		return 'border-gray-100';
	};

	// Format period display
	const getPeriodDisplay = () => {
		if (budget.period === 'yearly') {
			return `${budget.year}`;
		}
		const monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		return `${monthNames[(budget.month || 1) - 1]} ${budget.year}`;
	};

	// Get categories text
	const categoriesText = useMemo(() => {
		if (!budget.categories || budget.categories.length === 0) {
			return 'All categories';
		}
		if (budget.categories.length === 1) {
			return budget.categories[0].category.name;
		}
		return `${budget.categories.length} categories`;
	}, [budget.categories]);

	return (
		<div
			className={`group relative ${getBgColor()} rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg border ${getBorderColor()} transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 cursor-pointer h-full flex flex-col`}
			style={{
				animationDelay: `${index * 50}ms`,
				animationFillMode: 'backwards',
			}}
			onClick={() => onClick?.(budget)}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
						{budget.name || 'Monthly Budget'}
					</h3>
					<div className="flex items-center gap-2 text-xs text-gray-600">
						<Calendar className="h-3 w-3" />
						<span>{getPeriodDisplay()}</span>
					</div>
				</div>
				<div
					className={`flex items-center gap-1 px-2 py-1 rounded-full ${
						percentage >= 100
							? 'bg-red-100 text-red-700'
							: percentage >= 80
								? 'bg-orange-100 text-orange-700'
								: 'bg-green-100 text-green-700'
					}`}
				>
					{percentage >= 100 ? (
						<AlertCircle className="h-3 w-3" />
					) : (
						<TrendingUp className="h-3 w-3" />
					)}
					<span className="text-xs font-semibold">
						{percentage.toFixed(0)}%
					</span>
				</div>
			</div>

			{/* Budget Amount */}
			<div className="mb-3">
				<p className="text-xs text-gray-600 mb-1">Budget Limit</p>
				<p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
					{/* Desktop */}
					<span className="hidden sm:inline">
						{formatCurrency(budget.amount, budget.currency)}
					</span>
					{/* Mobile */}
					<span className="sm:hidden">
						{formatCurrencySymbol(budget.currency)}
						{budget.amount.toLocaleString('en-US', {
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						})}
					</span>
				</p>
			</div>

			{/* Progress Bar */}
			<div className="mb-3">
				<div className="flex items-center justify-between mb-2 text-xs">
					<span className="text-gray-600">
						Spent: {formatCurrencySymbol(budget.currency)}
						{spent.toLocaleString('en-US', {
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						})}
					</span>
					<span className={`font-semibold ${getStatusColor()}`}>
						{remaining >= 0 ? 'Remaining' : 'Over'}:{' '}
						{formatCurrencySymbol(budget.currency)}
						{Math.abs(remaining).toLocaleString('en-US', {
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						})}
					</span>
				</div>
				<Progress
					value={Math.min(percentage, 100)}
					className="h-2"
					indicatorClassName={getProgressColor()}
				/>
			</div>

			{/* Categories */}
			<div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-gray-100">
				<Tag className="h-3 w-3 text-gray-500" />
				<span className="text-xs text-gray-600 truncate">{categoriesText}</span>
			</div>

			{/* Alerts Indicator */}
			{(budget.alertAt80 || budget.alertAt100) && (
				<div className="absolute top-2 left-2">
					<div
						className="h-2 w-2 rounded-full bg-blue-500"
						title="Alerts enabled"
					/>
				</div>
			)}
		</div>
	);
};
