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
import { formatCurrency, formatDate } from '@/lib/utils';
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

	// Group expenses by month
	const groupedExpenses = expenses.reduce(
		(groups, expense) => {
			const date = new Date(expense.date);
			const monthYear = date.toLocaleDateString('en-US', {
				month: 'long',
				year: 'numeric',
			});

			if (!groups[monthYear]) {
				groups[monthYear] = [];
			}
			groups[monthYear].push(expense);
			return groups;
		},
		{} as Record<string, Expense[]>
	);

	const monthGroups = Object.entries(groupedExpenses).sort((a, b) => {
		const dateA = new Date(a[1][0].date);
		const dateB = new Date(b[1][0].date);
		return dateB.getTime() - dateA.getTime();
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
								<div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-200">
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
										<span className="font-medium">Delete</span>
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
							{/* Grouped Card List View by Month */}
							<div className="space-y-6">
								{monthGroups.map(([monthYear, monthExpenses]) => (
									<div key={monthYear} className="space-y-2">
										{/* Month Header */}
										<div className="flex items-center gap-2 pb-1">
											<h3 className="text-sm font-semibold text-gray-700">
												{monthYear}
											</h3>
											<div className="flex-1 h-px bg-gray-200"></div>
											<span className="text-xs text-gray-500">
												{monthExpenses.length} expense
												{monthExpenses.length !== 1 ? 's' : ''}
											</span>
										</div>

										{/* Month Expenses */}
										<div className="space-y-3">
											{monthExpenses.map((expense, index) => (
												<div
													key={expense.id}
													className="group relative bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-300 hover:shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2"
													style={{
														animationDelay: `${index * 50}ms`,
														animationFillMode: 'backwards',
													}}
												>
													{/* Content Container */}
													<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 pl-5 sm:pl-6">
														{/* Checkbox */}
														<Checkbox
															checked={selectedExpenses.includes(expense.id)}
															onCheckedChange={() =>
																onSelectExpense(expense.id)
															}
															className="flex-shrink-0"
														/>

														{/* Main Content */}
														<div
															className="flex-1 min-w-0 space-y-2 cursor-pointer"
															onClick={() => setViewingExpense(expense)}
															title="Click to view details"
														>
															{/* Title and Amount Row */}
															<div className="flex items-start justify-between gap-3">
																<h3 className="font-semibold text-lg text-gray-900 truncate">
																	{expense.title}
																</h3>
																<p className="text-xl font-bold text-gray-900 whitespace-nowrap flex-shrink-0">
																	{formatCurrency(
																		expense.amount,
																		expense.currency
																	)}
																</p>
															</div>

															{/* Category and Date Row */}
															<div className="flex flex-wrap items-center gap-2 text-sm">
																<span
																	className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors"
																	style={{
																		backgroundColor: expense.category.color
																			? `${expense.category.color}15`
																			: '#dbeafe',
																		color: expense.category.color || '#1e40af',
																	}}
																>
																	{expense.category.icon && (
																		<span className="text-base">
																			{expense.category.icon}
																		</span>
																	)}
																	<span>{expense.category.name}</span>
																</span>
																<span className="text-gray-400">•</span>
																<span className="text-gray-600 font-medium">
																	{formatDate(expense.date)}
																</span>
															</div>

															{/* Description */}
															{expense.description && (
																<p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
																	{expense.description}
																</p>
															)}
														</div>
													</div>{' '}
												</div>
											))}
										</div>
									</div>
								))}
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
					className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-sm p-4 animate-in fade-in duration-200 !m-0"
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
