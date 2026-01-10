import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ModernPagination } from '@/components/ui/modern-pagination';
import { Expense } from '@/lib/services';
import { Download, Package, Trash2 } from 'lucide-react';
import { ExpenseDetailDrawer } from './ExpenseDetailDrawer';
import { ExpenseCard } from './ExpenseCard';

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

	// Close detail modal if viewing expense was deleted (no longer in list)
	useEffect(() => {
		if (viewingExpense && !expenses.find(e => e.id === viewingExpense.id)) {
			setViewingExpense(null);
		}
	}, [expenses, viewingExpense]);

	// Memoize handlers to prevent unnecessary re-renders
	const handleCloseDetailModal = useCallback(() => {
		setViewingExpense(null);
	}, []);

	const handleViewExpense = useCallback((expense: Expense) => {
		setViewingExpense(expense);
	}, []);

	// Wrap edit handler to close detail drawer first
	const handleEdit = useCallback(
		(expense: Expense) => {
			setViewingExpense(null);
			setTimeout(() => {
				onEdit(expense);
			}, 300); // Vaul animation time
		},
		[onEdit]
	);

	// Wrap delete handler to close detail drawer first
	const handleDelete = useCallback(
		(expense: Expense) => {
			setViewingExpense(null);
			setTimeout(() => {
				onDelete(expense);
			}, 300); // Vaul animation time
		},
		[onDelete]
	);

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
										className="flex-1 shadow-sm"
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
										className="flex-1 shadow-sm"
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
							<div className="space-y-6 sm:space-y-8">
								{monthGroups.map(([monthYear, dateGroups]) => {
									const totalMonthExpenses = dateGroups.reduce(
										(sum, [, expenses]) => sum + expenses.length,
										0
									);

									return (
										<div key={monthYear} className="space-y-3 sm:space-y-5">
											{/* Month Header */}
											<div className="flex items-center gap-2 pb-1 sm:pb-2">
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
											<div className="space-y-4 sm:space-y-5">
												{dateGroups.map(([dateKey, dateExpenses]) => (
													<div key={dateKey} className="space-y-2 sm:space-y-3">
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
														<div className="space-y-2.5 sm:space-y-3">
															{dateExpenses.map((expense, index) => (
																<ExpenseCard
																	key={expense.id}
																	expense={expense}
																	isSelected={selectedExpenses.includes(
																		expense.id
																	)}
																	index={index}
																	onSelect={onSelectExpense}
																	onView={handleViewExpense}
																/>
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
								<div className="mt-6 pt-4 border-t">
									<ModernPagination
										currentPage={pagination.page}
										totalPages={pagination.pages}
										totalItems={pagination.total}
										itemsPerPage={pagination.limit}
										onPageChange={onPageChange}
										onItemsPerPageChange={onLimitChange || (() => {})}
										itemsPerPageOptions={[10, 20, 50, 100]}
									/>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Expense Detail Drawer */}
			<ExpenseDetailDrawer
				isOpen={!!viewingExpense}
				expense={viewingExpense}
				onClose={handleCloseDetailModal}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		</>
	);
};
