import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Category } from '@/lib/services';
import { Calendar, Clock, Edit, Package, Trash2, X } from 'lucide-react';

interface CategoryDetailDrawerProps {
	isOpen: boolean;
	category: Category | null;
	onClose: () => void;
	onEdit: (category: Category) => void;
	onDelete: (category: Category) => void;
}

interface CategoryInfoCardProps {
	icon: React.ElementType;
	iconColor: string;
	iconBgColor: string;
	label: string;
	children: React.ReactNode;
}

const CategoryInfoCard = ({
	icon: Icon,
	iconColor,
	iconBgColor,
	label,
	children,
}: CategoryInfoCardProps) => (
	<div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
		<div className="flex items-start gap-3">
			<div className={`${iconBgColor} p-2 rounded-lg`}>
				<Icon className={`h-4 w-4 ${iconColor}`} />
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-xs text-gray-500 mb-1">{label}</p>
				{children}
			</div>
		</div>
	</div>
);

export const CategoryDetailDrawer = ({
	isOpen,
	category,
	onClose,
	onEdit,
	onDelete,
}: CategoryDetailDrawerProps) => {
	// Keep a local copy to avoid immediate unmount so close animation runs
	const [localCategory, setLocalCategory] = useState<Category | null>(
		category || null
	);

	useEffect(() => {
		if (isOpen && category) {
			setLocalCategory(category);
		}
		if (!isOpen) {
			const t = window.setTimeout(() => setLocalCategory(null), 300);
			return () => window.clearTimeout(t);
		}
	}, [isOpen, category]);

	const expenseCount = localCategory?._count?.expenses ?? 0;

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	if (!localCategory && !isOpen) return null;

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[95vh] mx-auto w-full sm:max-w-lg md:max-w-xl flex flex-col">
				<DrawerHeader className="sr-only">
					<DrawerTitle>{localCategory?.name}</DrawerTitle>
				</DrawerHeader>

				<div className="overflow-y-auto flex-1">
					{/* Header with Gradient */}
					<div className="relative overflow-hidden">
						<div
							className="absolute inset-0 opacity-10"
							style={{
								background: `linear-gradient(135deg, ${localCategory?.color || '#3b82f6'} 0%, ${localCategory?.color || '#3b82f6'}dd 100%)`,
							}}
						/>
						<div className="relative px-4 md:px-6 py-4 md:py-6 lg:py-8">
							<div className="flex items-start justify-between mb-2 md:mb-3 lg:mb-4">
								<div
									className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl lg:text-2xl shadow-lg"
									style={{
										backgroundColor: localCategory?.color
											? `${localCategory?.color}30`
											: '#dbeafe',
									}}
								>
									{localCategory?.icon || '📁'}
								</div>
								<div
									className="px-2 md:px-2.5 lg:px-3 py-0.5 md:py-1 lg:py-1.5 rounded-full text-[10px] md:text-xs font-semibold shadow-sm"
									style={{
										backgroundColor: localCategory?.color
											? `${localCategory?.color}20`
											: '#dbeafe',
										color: localCategory?.color || '#1e40af',
									}}
								>
									Category
								</div>
							</div>
							<h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 break-words">
								{localCategory?.name}
							</h2>
							<div className="flex items-baseline gap-2">
								<span className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
									{expenseCount}
								</span>
								<span className="text-xs md:text-sm text-gray-600">
									{expenseCount === 1 ? 'expense' : 'expenses'}
								</span>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="p-3 md:p-4 lg:p-6 space-y-2 md:space-y-3 lg:space-y-4 bg-gray-50">
						{/* Color Card */}
						<CategoryInfoCard
							icon={Package}
							iconColor="text-purple-600"
							iconBgColor="bg-purple-50"
							label="Color"
						>
							<div className="flex items-center gap-2 mt-0.5">
								<div
									className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
									style={{ backgroundColor: localCategory?.color }}
								/>
								<p className="text-sm font-semibold text-gray-900">
									{localCategory?.color}
								</p>
							</div>
						</CategoryInfoCard>

						{/* Created At Card */}
						<CategoryInfoCard
							icon={Calendar}
							iconColor="text-blue-600"
							iconBgColor="bg-blue-50"
							label="Created At"
						>
							<p className="text-sm font-semibold text-gray-900 mt-0.5">
								{new Date(
									localCategory?.createdAt || new Date()
								).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</p>
						</CategoryInfoCard>

						{/* Updated At Card */}
						<CategoryInfoCard
							icon={Clock}
							iconColor="text-green-600"
							iconBgColor="bg-green-50"
							label="Last Updated"
						>
							<p className="text-sm font-semibold text-gray-900 mt-0.5">
								{new Date(
									localCategory?.updatedAt || new Date()
								).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
								})}
							</p>
						</CategoryInfoCard>

						{/* Expense Count Card */}
						<CategoryInfoCard
							icon={Package}
							iconColor="text-amber-600"
							iconBgColor="bg-amber-50"
							label="Total Expenses"
						>
							<p className="text-sm font-semibold text-gray-900 mt-0.5">
								{expenseCount} {expenseCount === 1 ? 'expense' : 'expenses'} in
								this category
							</p>
						</CategoryInfoCard>
					</div>
				</div>

				{/* Footer with Actions */}
				<DrawerFooter className="px-4 md:px-6 pb-2 md:pb-3 lg:pb-4 border-t flex-shrink-0 bg-background">
					<TooltipProvider>
						<div className="flex justify-between items-center">
							{/* Delete Button - Left */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										onClick={() => localCategory && onDelete(localCategory)}
										className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 border-2 border-red-500/30 hover:border-red-500/50 shadow-xl transition-all hover:scale-110"
									>
										<Trash2
											className="h-8 w-8 md:h-10 md:w-10 lg:h-11 lg:w-11"
											strokeWidth={3}
										/>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Delete category</p>
								</TooltipContent>
							</Tooltip>

							{/* Edit Button - Center */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										onClick={() => localCategory && onEdit(localCategory)}
										className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-2 border-blue-500/30 hover:border-blue-500/50 shadow-xl transition-all hover:scale-110"
									>
										<Edit
											className="h-8 w-8 md:h-10 md:w-10 lg:h-11 lg:w-11"
											strokeWidth={3}
										/>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Edit category</p>
								</TooltipContent>
							</Tooltip>

							{/* Close Button - Right */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										onClick={onClose}
										className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 border-2 border-gray-500/30 hover:border-gray-500/50 shadow-xl transition-all hover:scale-110"
									>
										<X
											className="h-8 w-8 md:h-10 md:w-10 lg:h-11 lg:w-11"
											strokeWidth={3}
										/>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Close</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</TooltipProvider>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
