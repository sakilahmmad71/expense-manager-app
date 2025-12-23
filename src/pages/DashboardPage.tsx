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
import { ExpenseModal } from '@/components/expenses';
import { DashboardSummary, Expense } from '@/lib/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FolderKanban, PiggyBank, Receipt, TrendingUp } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/hooks/useDashboard';
import { useCategories, CategoriesData } from '@/hooks/useCategories';

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
	const navigate = useNavigate();
	const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
	const [isFiltered, setIsFiltered] = useState(false);
	const [hasMixedCurrencies, setHasMixedCurrencies] = useState(false);
	const [primaryCurrency, setPrimaryCurrency] = useState('USD');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

	// Set document title and meta description
	useEffect(() => {
		document.title = 'Dashboard - Expense Manager';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'View your expense analytics, trends, and recent transactions'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'View your expense analytics, trends, and recent transactions';
			document.head.appendChild(meta);
		}
	}, []);

	const {
		summary: summaryData,
		recentExpenses: recentExpensesData,
		monthlyTrends: monthlyTrendsData,
		categoryAnalytics: categoryAnalyticsData,
		isLoading,
	} = useDashboard(isFiltered ? dateFilter : {});

	// Fetch categories for the modal
	const { data: categoriesData } = useCategories({ page: 1, limit: 100 });

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

	// Extract categories for the modal
	const categories = useMemo(
		() => (categoriesData as CategoriesData | undefined)?.categories || [],
		[categoriesData]
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
				<div
					className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300"
					id="dashboard-header"
				>
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
							Dashboard
						</h1>
						<p className="text-sm sm:text-base text-gray-600">
							Overview of your expenses
						</p>
					</div>
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg transition-colors duration-200"
					>
						<svg
							className="w-4 h-4 sm:w-5 sm:h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						<span className="text-sm sm:text-base">Add Expense</span>
					</button>
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
					id="date-filter"
				>
					<DateRangeFilter
						startDate={dateFilter.startDate}
						endDate={dateFilter.endDate}
						isFiltered={isFiltered}
						isLoading={isLoading}
						isOpen={isDateFilterOpen}
						onToggle={() => setIsDateFilterOpen(!isDateFilterOpen)}
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
					id="stats-overview"
				>
					{stats.map((stat, index) => (
						<StatCard key={stat.title} {...stat} index={index} />
					))}
					{/* Primary Charts */}
				</div>

				<div
					className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
					style={{ animationDelay: '200ms' }}
					id="primary-charts"
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
					id="trend-charts"
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
					id="category-analytics"
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
					id="recent-expenses"
				>
					<RecentExpensesList
						expenses={recentExpenses}
						formatCurrency={formatCurrency}
						formatDate={formatDate}
					/>
				</div>

				{/* Expense Modal */}
				{isModalOpen && (
					<ExpenseModal
						expense={null}
						categories={categories}
						onClose={() => setIsModalOpen(false)}
						onSuccess={() => {
							setIsModalOpen(false);
							navigate('/expenses');
						}}
					/>
				)}
			</div>
		</div>
	);
};
