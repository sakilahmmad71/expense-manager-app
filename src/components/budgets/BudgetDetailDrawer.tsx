import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useBudget } from '@/hooks/useBudgets';
import { Budget } from '@/lib/services';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import {
	TrendingDown,
	AlertTriangle,
	Edit,
	Trash2,
	Loader2,
} from 'lucide-react';

interface BudgetDetailDrawerProps {
	isOpen: boolean;
	budgetId: string | null;
	onClose: () => void;
	onEdit: (budget: Budget) => void;
	onDelete: (budget: Budget) => void;
}

const getStatusColor = (percentage: number) => {
	if (percentage >= 100)
		return { text: 'text-red-600', bg: 'bg-red-100', indicator: 'bg-red-600' };
	if (percentage >= 80)
		return {
			text: 'text-orange-600',
			bg: 'bg-orange-100',
			indicator: 'bg-orange-600',
		};
	return {
		text: 'text-green-600',
		bg: 'bg-green-100',
		indicator: 'bg-green-600',
	};
};

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

export const BudgetDetailDrawer = ({
	isOpen,
	budgetId,
	onClose,
	onEdit,
	onDelete,
}: BudgetDetailDrawerProps) => {
	const { data: budget, isLoading } = useBudget(budgetId || '');

	// Keep local copy for smooth animations
	const [localBudget, setLocalBudget] = useState<Budget | null>(null);

	useEffect(() => {
		if (isOpen && budget) {
			setLocalBudget(budget);
		}
		if (!isOpen) {
			const t = window.setTimeout(() => setLocalBudget(null), 300);
			return () => window.clearTimeout(t);
		}
	}, [isOpen, budget]);

	const handleEdit = () => {
		if (localBudget) {
			onEdit(localBudget);
		}
	};

	const handleDelete = () => {
		if (localBudget) {
			onDelete(localBudget);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	if (!budgetId) return null;

	const displayBudget = localBudget || budget;
	const spent = displayBudget?.spent || 0;
	const percentage = displayBudget?.percentage || 0;
	const remaining = displayBudget?.remaining || 0;
	const statusColor = displayBudget
		? getStatusColor(percentage)
		: { text: '', bg: '', indicator: '' };

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="sm:max-w-lg md:max-w-xl mx-auto max-h-[95vh] overflow-hidden flex flex-col">
				<DrawerHeader className="border-b flex-shrink-0 px-4 md:px-6 pt-3 md:pt-4 pb-2 md:pb-3">
					<DrawerTitle className="flex items-center gap-2 text-xl md:text-2xl font-bold">
						<TrendingDown className="h-5 w-5 md:h-6 md:w-6" />
						Budget Details
					</DrawerTitle>
				</DrawerHeader>
				<ScrollArea className="flex-1 px-4 md:px-6 overflow-y-auto">
					{isLoading ? (
						<div className="flex items-center justify-center h-64">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : !displayBudget ? (
						<div className="flex items-center justify-center h-64">
							<p className="text-muted-foreground">Budget not found</p>
						</div>
					) : (
						<div className="space-y-4 md:space-y-6 py-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
							{/* Budget Name */}
							{displayBudget.name && (
								<div>
									<h3 className="text-lg md:text-xl font-semibold">
										{displayBudget.name}
									</h3>
								</div>
							)}

							{/* Amount & Progress */}
							<div className="space-y-3">
								<div className="flex items-baseline justify-between">
									<div>
										<p className="text-sm text-muted-foreground">
											Budget Amount
										</p>
										<p className="text-2xl md:text-3xl font-bold">
											{displayBudget.currency}{' '}
											{displayBudget.amount.toLocaleString()}
										</p>
									</div>
									<div className="text-right">
										<p className="text-sm text-muted-foreground">Spent</p>
										<p
											className={cn('text-xl font-semibold', statusColor.text)}
										>
											{displayBudget.currency} {spent.toLocaleString()}
										</p>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">Progress</span>
										<span className={cn('font-medium', statusColor.text)}>
											{percentage.toFixed(1)}%
										</span>
									</div>
									<Progress
										value={Math.min(percentage, 100)}
										className="h-3"
										indicatorClassName={statusColor.indicator}
									/>
									<p className="text-sm text-muted-foreground text-right">
										{remaining >= 0
											? `${displayBudget.currency} ${remaining.toLocaleString()} remaining`
											: `${displayBudget.currency} ${Math.abs(remaining).toLocaleString()} over budget`}
									</p>
								</div>

								{/* Budget exceeded warning */}
								{percentage >= 100 && (
									<div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
										<AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
										<div>
											<p className="text-sm font-medium text-red-900">
												Budget Exceeded
											</p>
											<p className="text-sm text-red-700">
												You've exceeded your budget by {displayBudget.currency}{' '}
												{Math.abs(remaining).toLocaleString()}
											</p>
										</div>
									</div>
								)}

								{/* Near limit warning */}
								{percentage >= 80 && percentage < 100 && (
									<div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
										<AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
										<div>
											<p className="text-sm font-medium text-orange-900">
												Approaching Limit
											</p>
											<p className="text-sm text-orange-700">
												You've used {percentage.toFixed(1)}% of your budget
											</p>
										</div>
									</div>
								)}
							</div>

							<Separator />

							{/* Budget Details */}
							<div className="space-y-4">
								<h4 className="font-semibold">Budget Information</h4>

								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Period
										</span>
										<span className="text-sm font-medium capitalize">
											{displayBudget.period}
										</span>
									</div>

									{displayBudget.period === 'monthly' &&
										displayBudget.month && (
											<div className="flex items-center justify-between">
												<span className="text-sm text-muted-foreground">
													Month
												</span>
												<span className="text-sm font-medium">
													{months[displayBudget.month - 1]} {displayBudget.year}
												</span>
											</div>
										)}

									{displayBudget.period === 'yearly' && (
										<div className="flex items-center justify-between">
											<span className="text-sm text-muted-foreground">
												Year
											</span>
											<span className="text-sm font-medium">
												{displayBudget.year}
											</span>
										</div>
									)}

									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Currency
										</span>
										<span className="text-sm font-medium">
											{displayBudget.currency}
										</span>
									</div>
								</div>
							</div>

							{/* Alert Settings */}
							{(displayBudget.alertAt80 || displayBudget.alertAt100) && (
								<>
									<Separator />
									<div className="space-y-3">
										<h4 className="font-semibold">Alert Settings</h4>
										<div className="space-y-2">
											{displayBudget.alertAt80 && (
												<div className="flex items-center gap-2 text-sm">
													<div className="h-2 w-2 rounded-full bg-orange-500" />
													<span>Alert at 80% usage</span>
												</div>
											)}
											{displayBudget.alertAt100 && (
												<div className="flex items-center gap-2 text-sm">
													<div className="h-2 w-2 rounded-full bg-red-500" />
													<span>Alert at 100% usage</span>
												</div>
											)}
										</div>
									</div>
								</>
							)}

							{/* Categories */}
							{displayBudget.categories &&
								displayBudget.categories.length > 0 && (
									<>
										<Separator />
										<div className="space-y-3">
											<h4 className="font-semibold">Categories</h4>
											<div className="flex flex-wrap gap-2">
												{displayBudget.categories.map(bc => (
													<Badge
														key={bc.categoryId}
														variant="secondary"
														className="px-3 py-1"
													>
														<span className="mr-1">{bc.category.icon}</span>
														{bc.category.name}
													</Badge>
												))}
											</div>
										</div>
									</>
								)}

							{/* Notes */}
							{displayBudget.notes && (
								<>
									<Separator />
									<div className="space-y-2 md:space-y-3">
										<h4 className="font-semibold text-sm md:text-base">
											Notes
										</h4>
										<p className="text-sm text-muted-foreground whitespace-pre-wrap">
											{displayBudget.notes}
										</p>
									</div>
								</>
							)}
							<div className="space-y-2 text-xs text-muted-foreground">
								<div className="flex items-center justify-between">
									<span>Created</span>
									<span>
										{format(new Date(displayBudget.createdAt), 'PPp')}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Last Updated</span>
									<span>
										{format(new Date(displayBudget.updatedAt), 'PPp')}
									</span>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="grid grid-cols-2 gap-3 md:gap-4 pt-4">
								<Button
									variant="outline"
									onClick={handleEdit}
									className="w-full h-10 md:h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 bg-white"
								>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</Button>
								<Button
									variant="destructive"
									onClick={handleDelete}
									className="w-full h-10 md:h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</Button>
							</div>
						</div>
					)}
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
};
