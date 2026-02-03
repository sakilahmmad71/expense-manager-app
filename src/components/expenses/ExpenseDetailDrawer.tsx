import { useEffect, useState } from 'react';
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
import { formatCurrency, formatCurrencySymbol } from '@/lib/utils';
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
	// Keep a local copy so we don't unmount content immediately when parent
	// clears `expense`. This preserves the closing animation.
	const [localExpense, setLocalExpense] = useState<Expense | null>(
		expense || null
	);

	useEffect(() => {
		if (isOpen && expense) {
			setLocalExpense(expense);
		}
		if (!isOpen) {
			// wait for close animation to finish before clearing
			const t = window.setTimeout(() => setLocalExpense(null), 300);
			return () => window.clearTimeout(t);
		}
	}, [isOpen, expense]);

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	// If there's no content to show and the drawer isn't open, don't render
	if (!localExpense && !isOpen) return null;

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[95vh] mx-auto w-full sm:max-w-lg md:max-w-xl flex flex-col">
				<DrawerHeader className="sr-only">
					<DrawerTitle>{localExpense?.title}</DrawerTitle>
				</DrawerHeader>

				<div className="overflow-y-auto flex-1">
					{/* Header with Gradient */}
					<div className="relative overflow-hidden">
						<div
							className="absolute inset-0 opacity-10"
							style={{
								background: `linear-gradient(135deg, ${localExpense?.category.color || '#3b82f6'} 0%, ${localExpense?.category.color || '#3b82f6'}dd 100%)`,
							}}
						/>
						<div className="relative px-4 md:px-6 py-4 md:py-6 lg:py-8">
							<div className="flex items-start justify-between mb-2 md:mb-3 lg:mb-4">
								<div
									className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl lg:text-2xl shadow-lg"
									style={{
										backgroundColor: localExpense?.category.color
											? `${localExpense?.category.color}30`
											: '#dbeafe',
									}}
								>
									{localExpense?.category.icon || '💰'}
								</div>
								<div
									className="px-2 md:px-2.5 lg:px-3 py-0.5 md:py-1 lg:py-1.5 rounded-full text-[10px] md:text-xs font-semibold shadow-sm"
									style={{
										backgroundColor: localExpense?.category.color
											? `${localExpense?.category.color}20`
											: '#dbeafe',
										color: localExpense?.category.color || '#1e40af',
									}}
								>
									{localExpense?.category.name}
								</div>
							</div>
							<h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 break-words">
								{localExpense?.title}
							</h2>
							<div className="flex items-baseline gap-2">
								{/* Desktop: Full currency format */}
								<span className="hidden md:block text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
									{formatCurrency(
										localExpense?.amount || 0,
										localExpense?.currency || 'USD'
									)}
								</span>
								{/* Mobile: Symbol with amount */}
								<span className="md:hidden text-2xl font-bold text-gray-900">
									{formatCurrencySymbol(localExpense?.currency || 'USD')}
									{(localExpense?.amount || 0).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</span>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="p-3 md:p-4 lg:p-6 bg-gray-50">
						<div className="space-y-2 md:space-y-3 lg:space-y-4">
							{/* Date Card */}
							<ExpenseInfoCard
								icon={Calendar}
								iconColor="text-blue-600"
								iconBgColor="bg-blue-50"
								label="Expense Date"
							>
								<p className="text-sm font-semibold text-gray-900 mt-0.5">
									{new Date(
										localExpense?.date || new Date()
									).toLocaleDateString('en-US', {
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
									{localExpense?.currency}
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
									{new Date(
										localExpense?.createdAt || new Date()
									).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							</ExpenseInfoCard>

							{/* Description Card */}
							{localExpense?.description && (
								<ExpenseInfoCard
									icon={FileText}
									iconColor="text-amber-600"
									iconBgColor="bg-amber-50"
									label="Description"
									scrollable
								>
									<p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
										{localExpense?.description}
									</p>
								</ExpenseInfoCard>
							)}
						</div>
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
										onClick={() => localExpense && onDelete(localExpense)}
										className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 border-2 border-red-500/30 hover:border-red-500/50 shadow-xl transition-all hover:scale-110"
									>
										<Trash2
											className="h-8 w-8 md:h-10 md:w-10 lg:h-11 lg:w-11"
											strokeWidth={3}
										/>
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
										onClick={() => localExpense && onEdit(localExpense)}
										className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-2 border-blue-500/30 hover:border-blue-500/50 shadow-xl transition-all hover:scale-110"
									>
										<Edit
											className="h-8 w-8 md:h-10 md:w-10 lg:h-11 lg:w-11"
											strokeWidth={3}
										/>
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
