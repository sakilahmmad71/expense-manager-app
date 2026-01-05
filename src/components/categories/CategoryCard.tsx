import { Category } from '@/lib/services';
import { TrendingUp, TrendingDown, HandCoins } from 'lucide-react';
import { formatCurrency, formatCurrencySymbol } from '@/lib/utils';

interface CategoryCardProps {
	category: Category;
	index: number;
	onClick?: (category: Category) => void;
	primaryCurrency?: string;
}

export const CategoryCard = ({
	category,
	index,
	onClick,
	primaryCurrency = 'USD',
}: CategoryCardProps) => {
	const isPositiveGrowth = (category.growthPercentage ?? 0) >= 0;
	const hasGrowth =
		category.growthPercentage !== undefined && category.growthPercentage !== 0;

	return (
		<div
			className="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 cursor-pointer"
			style={{
				animationDelay: `${index * 50}ms`,
				animationFillMode: 'backwards',
			}}
			onClick={() => onClick?.(category)}
		>
			{/* Icon */}
			<div
				className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
				style={{
					backgroundColor: category.color ? `${category.color}15` : '#f3f4f6',
				}}
			>
				{category.icon || '📁'}
			</div>

			{/* Category Name */}
			<h3 className="text-base font-semibold text-gray-900 mb-3 truncate">
				{category.name}
			</h3>

			{/* Total Amount */}
			<p className="text-2xl font-bold text-gray-900 mb-4">
				{/* Desktop */}
				<span className="hidden sm:inline">
					{formatCurrency(category.totalAmount ?? 0, primaryCurrency)}
				</span>
				{/* Mobile */}
				<span className="sm:hidden">
					{formatCurrencySymbol(primaryCurrency)}
					{(category.totalAmount ?? 0).toLocaleString('en-US', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</span>
			</p>

			{/* Footer: Expense Count & Growth */}
			<div className="flex items-center justify-between text-sm">
				{/* Expense Count */}
				<div className="flex items-center gap-1.5 text-gray-600">
					<HandCoins className="h-4 w-4" />
					<span>{category._count?.expenses ?? 0} expenses</span>
				</div>

				{/* Growth Percentage */}
				{hasGrowth && (
					<div
						className="flex items-center gap-1"
						style={{
							color: isPositiveGrowth ? '#10b981' : '#ef4444',
						}}
					>
						{isPositiveGrowth ? (
							<TrendingUp className="h-4 w-4" />
						) : (
							<TrendingDown className="h-4 w-4" />
						)}
						<span className="font-semibold">
							{Math.abs(category.growthPercentage ?? 0).toFixed(0)}%
						</span>
					</div>
				)}
			</div>
		</div>
	);
};
