import {
	CategoryAnalyticsTable,
	CategoryBreakdownChart,
	DashboardSkeleton,
	DateRangeFilter,
	ExpenseTrendChart,
	MixedCurrencyWarning,
	MonthlyTrendsChart,
	RecentExpensesList,
	StatCard,
	TopCategoriesChart,
} from '@/components/dashboard';
import { DashboardSummary, Expense } from '@/lib/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FolderKanban, PiggyBank, Receipt, TrendingUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useDashboard } from '@/hooks/useDashboard';

interface CategoryAnalytics {
	categoryId: string;
	categoryName: string;
	color?: string;
	icon?: string;
	totalAmount: number;
	count: number;
	averageAmount: number;
}

export const DashboardPage = () => {
	const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
	const [isFiltered, setIsFiltered] = useState(false);
	const [hasMixedCurrencies, setHasMixedCurrencies] = useState(false);
	const [primaryCurrency, setPrimaryCurrency] = useState('USD');

	// Fetch all dashboard data with React Query
	const {
		summary: summaryData,
		recentExpenses: recentExpensesData,
		monthlyTrends: monthlyTrendsData,
		categoryAnalytics: categoryAnalyticsData,
		isLoading,
	} = useDashboard(isFiltered ? dateFilter : {});

	// Cast data to proper types with useMemo to avoid recreating on every render
	const summary = summaryData as DashboardSummary | undefined;
	const recentExpenses = useMemo(
		() => (recentExpensesData as Expense[] | undefined) || [],
		[recentExpensesData]
	);
	const monthlyTrends = useMemo(
		() =>
			(monthlyTrendsData as
				| Array<{ month: string; total: number }>
				| undefined) || [],
		[monthlyTrendsData]
	);
	const categoryAnalytics = useMemo(
		() => (categoryAnalyticsData as CategoryAnalytics[] | undefined) || [],
		[categoryAnalyticsData]
	);

	// Detect mixed currencies and primary currency
	useMemo(() => {
		if (!recentExpenses || recentExpenses.length === 0) return;

		const currencies = new Set(recentExpenses.map((e: Expense) => e.currency));
		setHasMixedCurrencies(currencies.size > 1);
		if (currencies.size > 0) {
			// Use the most common currency or the first one
			const currencyCount = recentExpenses.reduce(
				(acc: Record<string, number>, e: Expense) => {
					acc[e.currency] = (acc[e.currency] || 0) + 1;
					return acc;
				},
				{}
			);
			const mostCommon = (
				Object.entries(currencyCount) as Array<[string, number]>
			).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0];
			setPrimaryCurrency(mostCommon ? String(mostCommon[0]) : 'USD');
		}
	}, [recentExpenses]);

	const handleApplyFilter = () => {
		if (dateFilter.startDate || dateFilter.endDate) {
			setIsFiltered(true);
		}
	};

	const handleClearFilter = () => {
		setDateFilter({ startDate: '', endDate: '' });
		setIsFiltered(false);
	};

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	const categoryData = summary?.categoryBreakdown
		? Object.entries(summary.categoryBreakdown).map(([name, value]) => ({
				name,
				value: value as number,
			}))
		: [];

	// Calculate trend percentage
	const calculateTrend = () => {
		if (monthlyTrends.length < 2) return { percentage: 0, isIncrease: true };
		const current = monthlyTrends[monthlyTrends.length - 1]?.total || 0;
		const previous = monthlyTrends[monthlyTrends.length - 2]?.total || 0;
		if (previous === 0) return { percentage: 0, isIncrease: current > 0 };
		const percentage = ((current - previous) / previous) * 100;
		return { percentage: Math.abs(percentage), isIncrease: percentage >= 0 };
	};

	const trend = calculateTrend();

	// Top 5 categories for bar chart
	const topCategories = categoryAnalytics
		.sort(
			(a: CategoryAnalytics, b: CategoryAnalytics) =>
				b.totalAmount - a.totalAmount
		)
		.slice(0, 5);

	const stats = [
		{
			title: 'Total Expenses',
			value: hasMixedCurrencies
				? `${formatCurrency(summary?.totalAmount || 0, primaryCurrency)} *`
				: formatCurrency(summary?.totalAmount || 0, primaryCurrency),
			icon: PiggyBank,
			iconBg: 'bg-blue-100',
			iconColor: 'text-blue-600',
			trend:
				trend.percentage > 0
					? `${trend.isIncrease ? '↑' : '↓'} ${trend.percentage.toFixed(1)}%`
					: undefined,
			trendColor: trend.isIncrease ? 'text-red-600' : 'text-green-600',
		},
		{
			title: 'Total Count',
			value: summary?.totalCount || 0,
			icon: Receipt,
			iconBg: 'bg-green-100',
			iconColor: 'text-green-600',
		},
		{
			title: 'Average Expense',
			value: hasMixedCurrencies
				? `${formatCurrency(summary?.averageExpense || 0, primaryCurrency)} *`
				: formatCurrency(summary?.averageExpense || 0, primaryCurrency),
			icon: TrendingUp,
			iconBg: 'bg-orange-100',
			iconColor: 'text-orange-600',
		},
		{
			title: 'Categories',
			value: Object.keys(summary?.categoryBreakdown || {}).length,
			icon: FolderKanban,
			iconBg: 'bg-purple-100',
			iconColor: 'text-purple-600',
		},
	];

	return (
		<div className="py-6 px-2 sm:px-6 md:container md:mx-auto lg:px-8 min-h-screen">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
							Dashboard
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							Overview of your expenses
						</p>
					</div>
				</div>

				{/* Mixed Currency Warning */}
				{hasMixedCurrencies && (
					<div
						className="animate-in fade-in slide-in-from-top-4 duration-300"
						style={{ animationDelay: '50ms' }}
					>
						<MixedCurrencyWarning primaryCurrency={primaryCurrency} />
					</div>
				)}

				{/* Date Filter */}
				<div
					className="animate-in fade-in slide-in-from-top-4 duration-300"
					style={{ animationDelay: '100ms' }}
				>
					<DateRangeFilter
						startDate={dateFilter.startDate}
						endDate={dateFilter.endDate}
						isFiltered={isFiltered}
						isLoading={isLoading}
						onStartDateChange={value =>
							setDateFilter({ ...dateFilter, startDate: value })
						}
						onEndDateChange={value =>
							setDateFilter({ ...dateFilter, endDate: value })
						}
						onApplyFilter={handleApplyFilter}
						onClearFilter={handleClearFilter}
					/>
				</div>

				{/* Stats Grid */}
				<div
					className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
					style={{ animationDelay: '150ms' }}
				>
					{stats.map((stat, index) => (
						<StatCard key={stat.title} {...stat} index={index} />
					))}
				</div>

				{/* Charts */}
				<div
					className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
					style={{ animationDelay: '200ms' }}
				>
					<MonthlyTrendsChart
						data={monthlyTrends}
						primaryCurrency={primaryCurrency}
						formatCurrency={formatCurrency}
					/>
					<CategoryBreakdownChart
						data={categoryData}
						primaryCurrency={primaryCurrency}
						formatCurrency={formatCurrency}
					/>
				</div>

				{/* Additional Charts */}
				<div
					className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
					style={{ animationDelay: '250ms' }}
				>
					<ExpenseTrendChart
						data={monthlyTrends}
						primaryCurrency={primaryCurrency}
						formatCurrency={formatCurrency}
					/>
					<TopCategoriesChart
						data={topCategories}
						primaryCurrency={primaryCurrency}
						formatCurrency={formatCurrency}
					/>
				</div>

				{/* Category Analytics Table */}
				<div
					className="animate-in fade-in slide-in-from-bottom-4 duration-500"
					style={{ animationDelay: '300ms' }}
				>
					<CategoryAnalyticsTable
						data={categoryAnalytics}
						primaryCurrency={primaryCurrency}
						formatCurrency={formatCurrency}
					/>
				</div>

				{/* Recent Expenses */}
				<div
					className="animate-in fade-in slide-in-from-bottom-4 duration-500"
					style={{ animationDelay: '350ms' }}
				>
					<RecentExpensesList
						expenses={recentExpenses}
						formatCurrency={formatCurrency}
						formatDate={formatDate}
					/>
				</div>
			</div>
		</div>
	);
};
