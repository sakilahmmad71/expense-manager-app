import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/lib/services';
import { EmptyState } from '@/components/ui/empty-state';
import { Receipt } from 'lucide-react';
import { formatCurrencySymbol } from '@/lib/utils';

interface RecentExpensesListProps {
	expenses: Expense[];
	formatCurrency: (value: number, currency: string) => string;
	formatDate: (date: string) => string;
}

export const RecentExpensesList = ({
	expenses,
	formatCurrency,
	formatDate,
}: RecentExpensesListProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm md:text-base">Recent Expenses</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{expenses.length === 0 ? (
						<EmptyState
							icon={Receipt}
							title="No expenses yet"
							description="Start tracking your expenses by adding your first one"
						/>
					) : (
						expenses.map((expense, index) => (
							<div
								key={expense.id}
								className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
								style={{
									animationDelay: `${index * 50}ms`,
									animationFillMode: 'backwards',
								}}
							>
								{/* Mobile & Desktop Layout */}
								<div className="flex items-start gap-3 flex-1 w-full">
									<div
										className="w-1 h-12 sm:h-14 rounded-full flex-shrink-0"
										style={{}}
									/>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-sm md:text-base truncate">
											{expense.title}
										</h3>
										<div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] md:text-xs text-gray-500 mt-1">
											<span
												className="inline-flex items-center px-2 py-0.5 rounded text-[10px] md:text-xs font-medium"
												style={{
													backgroundColor: expense.category.color
														? `${expense.category.color}20`
														: '#dbeafe',
													color: expense.category.color || '#1e40af',
												}}
											>
												{expense.category.icon && (
													<span className="mr-1">{expense.category.icon}</span>
												)}
												{expense.category.name}
											</span>
											<span className="hidden sm:inline">•</span>
											<span className="text-[10px] md:text-xs">
												{formatDate(expense.date)}
											</span>
										</div>
										{expense.description && (
											<p className="text-[10px] md:text-xs text-gray-600 mt-1 line-clamp-2">
												{expense.description}
											</p>
										)}
									</div>
								</div>

								{/* Amount Display */}
								<div className="text-left sm:text-right pl-4 sm:pl-0">
									{/* Desktop: Full currency format */}
									<p className="hidden sm:block text-base md:text-lg font-bold whitespace-nowrap">
										{formatCurrency(expense.amount, expense.currency)}
									</p>
									{/* Mobile: Symbol with amount */}
									<p className="sm:hidden text-sm font-bold whitespace-nowrap">
										{formatCurrencySymbol(expense.currency)}
										{expense.amount.toLocaleString('en-US', {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
};
