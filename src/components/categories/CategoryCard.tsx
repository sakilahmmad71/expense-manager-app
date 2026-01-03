import { Category } from '@/lib/services';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
	category: Category;
	index: number;
	onClick?: (category: Category) => void;
}

export const CategoryCard = ({
	category,
	index,
	onClick,
}: CategoryCardProps) => {
	return (
		<div
			className="group relative p-4 sm:p-6 border-2 rounded-lg hover:shadow-md transition-shadow duration-200 animate-in fade-in slide-in-from-bottom-2 cursor-pointer"
			style={{
				borderColor: category.color || '#e5e7eb',
				animationDelay: `${index * 50}ms`,
				animationFillMode: 'backwards',
			}}
			onClick={() => onClick?.(category)}
		>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-2">
					{category.icon && (
						<span className="text-xl sm:text-2xl">{category.icon}</span>
					)}
					<h3 className="font-semibold text-base sm:text-lg truncate">
						{category.name}
					</h3>
				</div>
				<div className="space-y-2">
					{category.color && (
						<div className="flex items-center gap-2 text-xs text-gray-500">
							<div
								className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border"
								style={{ backgroundColor: category.color }}
							/>
							<span className="font-mono text-[10px] sm:text-xs">
								{category.color}
							</span>
						</div>
					)}
					<Badge variant="secondary" className="text-[10px] sm:text-xs">
						{category._count?.expenses ?? 0} expense
						{category._count?.expenses !== 1 ? 's' : ''}
					</Badge>
				</div>
			</div>
		</div>
	);
};
