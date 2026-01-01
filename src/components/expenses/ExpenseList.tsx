import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Expense } from '@/lib/services';
import { formatCurrency, formatCurrencySymbol } from '@/lib/utils';
import {
	ChevronLeft,
	ChevronRight,
	Download,
	Package,
	Trash2,
} from 'lucide-react';
import { ExpenseDetailModal } from './ExpenseDetailModal';

interface Pagination {
	total: number;
	pages: number;
	page: number;
	limit: number;
}

interface ExpenseListProps {
	expenses: Expense[];
	selectedExpenses: string[];
	pagination: Pagination;
	onSelectExpense: (id: string) => void;
	onSelectAll: () => void;
	onEdit: (expense: Expense) => void;
	onDelete: (expense: Expense) => void;
	onPageChange: (page: number) => void;
	onLimitChange?: (limit: number) => void;
	onAddExpense?: () => void;
	onExport?: () => void;
	onBulkDelete?: () => void;
}

export const ExpenseList = ({
	expenses,
	selectedExpenses,
	pagination,
	onSelectExpense,
	onSelectAll,
	onEdit,
	onDelete,
	onPageChange,
	onLimitChange,
	onExport,
	onBulkDelete,
}: ExpenseListProps) => {
	const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);

	// Group expenses by month, then by date
	const groupedExpenses = expenses.reduce(
		(groups, expense) => {
			const date = new Date(expense.date);
			const monthYear = date.toLocaleDateString('en-US', {
				month: 'long',
				year: 'numeric',
			});

			if (!groups[monthYear]) {
				groups[monthYear] = {};
			}

			const dateKey = date.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});

			if (!groups[monthYear][dateKey]) {
				groups[monthYear][dateKey] = [];
			}

			groups[monthYear][dateKey].push(expense);
			return groups;
		},
		{} as Record<string, Record<string, Expense[]>>
	);

	const monthGroups: [string, [string, Expense[]][]][] = Object.entries(
		groupedExpenses
	)
		.sort((a, b) => {
			// Sort months by newest first
			const dateA = new Date(Object.values(a[1])[0][0].date);
			const dateB = new Date(Object.values(b[1])[0][0].date);
			return dateB.getTime() - dateA.getTime();
		})
		.map(([monthYear, dateGroups]) => {
			// Sort dates within each month
			const sortedDates: [string, Expense[]][] = Object.entries(dateGroups)
				.sort((a, b) => {
					const dateA = new Date(a[1][0].date).getTime();
					const dateB = new Date(b[1][0].date).getTime();
					return dateB - dateA; // Newest date first
				})
				.map(([dateKey, dateExpenses]) => [
					dateKey,
					// Sort expenses within each date by createdAt
					dateExpenses.sort((a, b) => {
						const createdA = new Date(a.createdAt).getTime();
						const createdB = new Date(b.createdAt).getTime();
						return createdB - createdA; // Most recently created first
					}),
				]);

			return [monthYear, sortedDates];
		});

	return (
		<>
			<Card>
				<CardHeader>
					<div className="space-y-4">
						{/* Title and Select All Row */}
						<div className="flex items-center justify-between">
							<CardTitle>
								All Expenses
								<span className="text-sm font-normal text-muted-foreground ml-2">
									({pagination.total} total)
								</span>
							</CardTitle>
							{expenses.length > 0 && (
								<div className="flex items-center gap-1.5 px-2 py-1 rounded-md">
									<Checkbox
										checked={selectedExpenses.length === expenses.length}
										onCheckedChange={onSelectAll}
										id="select-all"
									/>
									<label
										htmlFor="select-all"
										className="text-xs font-medium text-gray-700 cursor-pointer select-none whitespace-nowrap"
									>
										Select All
										{selectedExpenses.length > 0 && (
											<span className="ml-1 text-xs text-gray-500">
												({selectedExpenses.length})
											</span>
										)}
									</label>
								</div>
							)}
						</div>

						{/* Mobile Action Buttons */}
						<div className="md:hidden space-y-3">
							<div className="flex gap-2">
								{/* Removed Add Expense button - using FAB instead */}
								{onBulkDelete && (
									<Button
										onClick={onBulkDelete}
										variant="destructive"
										size="sm"
										disabled={selectedExpenses.length === 0}
										className="flex-1 h-10 shadow-sm"
									>
										<Trash2 className="h-4 w-4 mr-2" />
										<span className="font-medium">
											Delete{' '}
											{selectedExpenses.length > 0 &&
												`(${selectedExpenses.length})`}
										</span>
									</Button>
								)}
								{onExport && (
									<Button
										onClick={onExport}
										variant="outline"
										size="sm"
										disabled={expenses.length === 0}
										className="flex-1 h-10 shadow-sm"
									>
										<Download className="h-4 w-4 mr-2" />
										<span className="font-medium">Export</span>
									</Button>
								)}
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{expenses.length === 0 ? (
						<div className="text-center py-12">
							<Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500 text-lg">No expenses found</p>
							<p className="text-gray-400 text-sm mt-1">
								Try adjusting your filters or add a new expense
							</p>
						</div>
					) : (
						<>
							{/* Grouped Card List View by Month and Date */}
							<div className="space-y-3 sm:space-y-6">
								{monthGroups.map(([monthYear, dateGroups]) => {
									const totalMonthExpenses = dateGroups.reduce(
										(sum, [, expenses]) => sum + expenses.length,
										0
									);

									return (
										<div key={monthYear} className="space-y-2 sm:space-y-4">
											{/* Month Header */}
											<div className="flex items-center gap-2 pb-0.5 sm:pb-1">
												<h3 className="text-sm font-semibold text-gray-700">
													{monthYear}
												</h3>
												<div className="flex-1 h-px bg-gray-200"></div>
												<span className="text-xs text-gray-500">
													{totalMonthExpenses} expense
													{totalMonthExpenses !== 1 ? 's' : ''}
												</span>
											</div>

											{/* Date Groups within Month */}
											<div className="space-y-2 sm:space-y-4">
												{dateGroups.map(([dateKey, dateExpenses]) => (
													<div key={dateKey} className="space-y-1 sm:space-y-2">
														{/* Date Header */}
														<div className="flex items-center gap-2 pl-1 sm:pl-2">
															<h4 className="text-xs font-medium text-gray-600">
																{dateKey}
															</h4>
															<div className="flex-1 h-px bg-gray-100"></div>
															<span className="text-xs text-gray-400">
																{dateExpenses.length}
															</span>
														</div>

														{/* Expenses for this Date */}
														<div className="space-y-1.5 sm:space-y-2">
															{dateExpenses.map((expense, index) => (
																<div
																	key={expense.id}
																	className="group relative bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2"
																	style={{
																		animationDelay: `${index * 50}ms`,
																		animationFillMode: 'backwards',
																	}}
																>
																	{/* Content Container */}
																	<div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
																		{/* Checkbox */}
																		<Checkbox
																			checked={selectedExpenses.includes(
																				expense.id
																			)}
																			onCheckedChange={() =>
																				onSelectExpense(expense.id)
																			}
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
																			onClick={() => setViewingExpense(expense)}
																			title="Click to view details"
																		>
																			<h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
																				{expense.title}
																			</h3>
																			<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-0.5">
																				<span className="truncate">
																					{expense.category?.name ||
																						'Uncategorized'}
																				</span>
																			</div>
																		</div>

																		{/* Amount */}
																		<div className="flex-shrink-0 text-right">
																			{/* Desktop: Full currency format */}
																			<p className="hidden sm:block text-lg font-bold text-gray-900">
																				{formatCurrency(
																					expense.amount,
																					expense.currency
																				)}
																			</p>
																			{/* Mobile: Symbol only */}
																			<p className="sm:hidden text-base font-bold text-gray-900">
																				{formatCurrencySymbol(
																					expense.amount,
																					expense.currency
																				)}
																			</p>
																		</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												))}
											</div>
										</div>
									);
								})}
							</div>

							{/* Pagination */}
							{pagination.pages > 1 && (
								<div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t">
									<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
										<span>Items per page:</span>
										{onLimitChange && (
											<Select
												value={pagination.limit.toString()}
												onValueChange={value => onLimitChange(parseInt(value))}
											>
												<SelectTrigger className="h-8 w-[70px]">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="10">10</SelectItem>
													<SelectItem value="20">20</SelectItem>
													<SelectItem value="50">50</SelectItem>
													<SelectItem value="100">100</SelectItem>
												</SelectContent>
											</Select>
										)}
										<span className="hidden sm:inline">
											| Showing {(pagination.page - 1) * pagination.limit + 1}-
											{Math.min(
												pagination.page * pagination.limit,
												pagination.total
											)}{' '}
											of {pagination.total}
										</span>
									</div>
									<div className="flex gap-1 sm:gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => onPageChange(pagination.page - 1)}
											disabled={pagination.page === 1}
											className="text-xs sm:text-sm"
										>
											<ChevronLeft className="h-4 w-4" />
											<span className="hidden sm:inline ml-1">Previous</span>
										</Button>
										<div className="flex items-center gap-0.5 sm:gap-1">
											{Array.from({ length: pagination.pages }, (_, i) => i + 1)
												.filter(
													page =>
														page === 1 ||
														page === pagination.pages ||
														(page >= pagination.page - 1 &&
															page <= pagination.page + 1)
												)
												.map((page, index, array) => (
													<>
														{index > 0 && array[index - 1] !== page - 1 && (
															<span className="px-1 text-xs sm:px-2 sm:text-sm text-gray-400">
																...
															</span>
														)}
														<Button
															key={page}
															variant={
																pagination.page === page ? 'default' : 'outline'
															}
															size="sm"
															onClick={() => onPageChange(page)}
															className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-xs sm:text-sm"
														>
															{page}
														</Button>
													</>
												))}
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => onPageChange(pagination.page + 1)}
											disabled={pagination.page === pagination.pages}
											className="text-xs sm:text-sm"
										>
											<span className="hidden sm:inline mr-1">Next</span>
											<ChevronRight className="h-4 w-4" />
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Expense Detail Modal */}
			{viewingExpense && (
				<div
					className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200 !m-0"
					onClick={() => setViewingExpense(null)}
				>
					<ExpenseDetailModal
						expense={viewingExpense}
						onClose={() => setViewingExpense(null)}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				</div>
			)}
		</>
	);
};
