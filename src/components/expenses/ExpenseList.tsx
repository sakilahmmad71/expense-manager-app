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
	Edit,
	Package,
	Plus,
	Trash2,
} from 'lucide-react';

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
	onAddExpense,
	onExport,
	onBulkDelete,
}: ExpenseListProps) => {
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
							{onAddExpense && (
								<Button
									onClick={onAddExpense}
									size="sm"
									className="flex-1 h-10 shadow-sm"
								>
									<Plus className="h-4 w-4 mr-2" />
									<span className="font-medium">Add Expense</span>
								</Button>
							)}
						</div>
						<div className="flex gap-2">
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
												className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
												style={{
													animationDelay: `${index * 50}ms`,
													animationFillMode: 'backwards',
												}}
											>
												{/* Mobile Layout - Top Row */}
												<div className="flex items-start gap-3 flex-1 w-full">
													<Checkbox
														checked={selectedExpenses.includes(expense.id)}
														onCheckedChange={() => onSelectExpense(expense.id)}
														className="mt-1 flex-shrink-0"
													/>
													<div
														className="w-1 h-12 sm:h-14 rounded-full flex-shrink-0"
														style={{}}
													/>
													<div className="flex-1 min-w-0">
														<h3 className="font-semibold text-base sm:text-lg truncate">
															{expense.title}
														</h3>
														<div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mt-1">
															<span
																className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
																style={{
																	backgroundColor: expense.category.color
																		? `${expense.category.color}20`
																		: '#dbeafe',
																	color: expense.category.color || '#1e40af',
																}}
															>
																{expense.category.icon && (
																	<span className="mr-1">
																		{expense.category.icon}
																	</span>
																)}
																{expense.category.name}
															</span>
															<span className="hidden sm:inline">•</span>
															<span className="text-xs">
																{formatDate(expense.date)}
															</span>
														</div>
														{expense.description && (
															<p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
																{expense.description}
															</p>
														)}
													</div>
												</div>

												{/* Mobile Layout - Bottom Row / Desktop Right Side */}
												<div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pl-8 sm:pl-0">
													<div className="text-left sm:text-right">
														<p className="text-lg sm:text-xl font-bold whitespace-nowrap">
															{formatCurrency(expense.amount, expense.currency)}
														</p>
													</div>
													<div className="flex gap-1 sm:gap-2 flex-shrink-0">
														<Button
															variant="outline"
															size="sm"
															onClick={() => onEdit(expense)}
															className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex items-center justify-center"
														>
															<Edit className="h-3 w-3 sm:h-4 sm:w-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => onDelete(expense)}
															className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
														>
															<Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
														</Button>
													</div>
												</div>
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
	);
};
