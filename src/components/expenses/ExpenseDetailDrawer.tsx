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
import { Expense } from '@/lib/services';
import { formatCurrency } from '@/lib/utils';
import {
	Calendar,
	Clock,
	DollarSign,
	Edit,
	FileText,
	Trash2,
	X,
} from 'lucide-react';
import { ExpenseInfoCard } from './ExpenseInfoCard';

interface ExpenseDetailDrawerProps {
	isOpen: boolean;
	expense: Expense | null;
	onClose: () => void;
	onEdit: (expense: Expense) => void;
	onDelete: (expense: Expense) => void;
}

export const ExpenseDetailDrawer = ({
	isOpen,
	expense,
	onClose,
	onEdit,
	onDelete,
}: ExpenseDetailDrawerProps) => {
	if (!expense) return null;

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[95vh] mx-auto w-full sm:max-w-lg md:max-w-xl flex flex-col">
				<DrawerHeader className="sr-only">
					<DrawerTitle>{expense.title}</DrawerTitle>
				</DrawerHeader>

				<div className="overflow-y-auto flex-1">
					{/* Header with Gradient */}
					<div className="relative overflow-hidden">
						<div
							className="absolute inset-0 opacity-10"
							style={{
								background: `linear-gradient(135deg, ${expense.category.color || '#3b82f6'} 0%, ${expense.category.color || '#3b82f6'}dd 100%)`,
							}}
						/>
						<div className="relative px-4 sm:px-6 py-6 sm:py-8">
							<div className="flex items-start justify-between mb-3 sm:mb-4">
								<div
									className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg"
									style={{
										backgroundColor: expense.category.color
											? `${expense.category.color}30`
											: '#dbeafe',
									}}
								>
									{expense.category.icon || '💰'}
								</div>
								<div
									className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold shadow-sm"
									style={{
										backgroundColor: expense.category.color
											? `${expense.category.color}20`
											: '#dbeafe',
										color: expense.category.color || '#1e40af',
									}}
								>
									{expense.category.name}
								</div>
							</div>
							<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
								{expense.title}
							</h2>
							<div className="flex items-baseline gap-2">
								<span className="text-3xl sm:text-4xl font-bold text-gray-900">
									{formatCurrency(expense.amount, expense.currency)}
								</span>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="p-4 sm:p-6 bg-gray-50">
						<div className="space-y-3 sm:space-y-4">
							{/* Date Card */}
							<ExpenseInfoCard
								icon={Calendar}
								iconColor="text-blue-600"
								iconBgColor="bg-blue-50"
								label="Expense Date"
							>
								<p className="text-sm font-semibold text-gray-900 mt-0.5">
									{new Date(expense.date).toLocaleDateString('en-US', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</p>
							</ExpenseInfoCard>

							{/* Currency Card */}
							<ExpenseInfoCard
								icon={DollarSign}
								iconColor="text-green-600"
								iconBgColor="bg-green-50"
								label="Currency"
							>
								<p className="text-sm font-semibold text-gray-900 mt-0.5">
									{expense.currency}
								</p>
							</ExpenseInfoCard>

							{/* Created At Card */}
							<ExpenseInfoCard
								icon={Clock}
								iconColor="text-purple-600"
								iconBgColor="bg-purple-50"
								label="Created At"
							>
								<p className="text-sm font-semibold text-gray-900 mt-0.5">
									{new Date(expense.createdAt).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							</ExpenseInfoCard>

							{/* Description Card */}
							{expense.description && (
								<ExpenseInfoCard
									icon={FileText}
									iconColor="text-amber-600"
									iconBgColor="bg-amber-50"
									label="Description"
									scrollable
								>
									<p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
										{expense.description}
									</p>
								</ExpenseInfoCard>
							)}
						</div>
					</div>
				</div>

				{/* Footer with Actions */}
				<DrawerFooter className="px-4 sm:px-6 pb-3 sm:pb-4 border-t flex-shrink-0 bg-background">
					<TooltipProvider>
						<div className="flex justify-between items-center">
							{/* Delete Button - Left */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										onClick={() => onDelete(expense)}
										className="h-16 w-16 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 border-2 border-red-500/30 hover:border-red-500/50 shadow-xl transition-all hover:scale-110"
									>
										<Trash2 className="h-11 w-11" strokeWidth={3} />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Delete expense</p>
								</TooltipContent>
							</Tooltip>

							{/* Edit Button - Center */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										onClick={() => onEdit(expense)}
										className="h-16 w-16 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-2 border-blue-500/30 hover:border-blue-500/50 shadow-xl transition-all hover:scale-110"
									>
										<Edit className="h-11 w-11" strokeWidth={3} />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Edit expense</p>
								</TooltipContent>
							</Tooltip>

							{/* Close Button - Right */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										onClick={onClose}
										className="h-16 w-16 rounded-full bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 border-2 border-gray-500/30 hover:border-gray-500/50 shadow-xl transition-all hover:scale-110"
									>
										<X className="h-11 w-11" strokeWidth={3} />
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
