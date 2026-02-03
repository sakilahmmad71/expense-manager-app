import {
	CategoryAnalyticsTable,
	DashboardSkeleton,
	DateRangeFilter,
	MixedCurrencyWarning,
	RecentExpensesList,
	StatCard,
} from '@/components/dashboard';
import { ExpenseDrawer } from '@/components/expenses';
import { ExpenseDialog } from '@/components/expenses/ExpenseDialog';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { Button } from '@/components/ui/button';
import { DashboardSummary, Expense } from '@/lib/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import { formatNumberWithTooltip } from '@/lib/formatNumber';
import { Wallet, Calculator, BarChart3, Tags, Plus } from 'lucide-react';
import {
	useState,
	useMemo,
	useEffect,
	useCallback,
	lazy,
	Suspense,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Lazy load chart components to reduce initial bundle size
const MonthlyTrendsChart = lazy(() =>
	import('@/components/dashboard/MonthlyTrendsChart').then(module => ({
		default: module.MonthlyTrendsChart,
	}))
);
const ExpenseTrendChart = lazy(() =>
	import('@/components/dashboard/ExpenseTrendChart').then(module => ({
		default: module.ExpenseTrendChart,
	}))
);
const CategoryBreakdownChart = lazy(() =>
	import('@/components/dashboard/CategoryBreakdownChart').then(module => ({
		default: module.CategoryBreakdownChart,
	}))
);
const TopCategoriesChart = lazy(() =>
	import('@/components/dashboard/TopCategoriesChart').then(module => ({
		default: module.TopCategoriesChart,
	}))
);

interface CategoryAnalytics {
	categoryId: string;
	categoryName: string;
	color?: string;
	icon?: string;
	totalAmount: number;
	count: number;
	averageAmount: number;
}

// Chart loading skeleton component
const ChartSkeleton = () => (
	<div className="rounded-lg border bg-card p-6 space-y-4">
		<Skeleton className="h-6 w-48" />
		<Skeleton className="h-[300px] w-full" />
	</div>
);

export const DashboardPage = () => {
	const navigate = useNavigate();
	const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
	const [isFiltered, setIsFiltered] = useState(false);
	const [hasMixedCurrencies, setHasMixedCurrencies] = useState(false);
	const [primaryCurrency, setPrimaryCurrency] = useState('USD');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

	// Detect mobile vs desktop (md breakpoint = 768px)
	const isDesktop = useMediaQuery('(min-width: 768px)');

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
		isFetching,
	} = useDashboard(isFiltered ? dateFilter : {});

	// Cast data to proper types with useMemo to avoid recreating on every render
	const summary = (summaryData as { summary?: DashboardSummary })?.summary;
	const recentExpenses = useMemo(() => {
		const expenses =
			(recentExpensesData as { expenses?: Expense[] })?.expenses || [];
		return expenses;
	}, [recentExpensesData]);
	const monthlyTrends = useMemo(() => {
		const trends =
			(
				monthlyTrendsData as {
					trends?: Array<{ month: string; total: number }>;
				}
			)?.trends || [];
		// Transform the data to match chart expectations and format month names
		return trends.map(trend => {
			// Parse YYYY-MM format to readable month name
			const [year, monthNum] = trend.month.split('-');
			const date = new Date(parseInt(year), parseInt(monthNum) - 1);
			const monthName = date.toLocaleDateString('en-US', {
				month: 'short',
				year: 'numeric',
			});

			return {
				month: trend.month,
				monthName: monthName, // e.g., "Jan 2025"
				total: trend.total,
				totalAmount: trend.total,
			};
		});
	}, [monthlyTrendsData]);
	const categoryAnalytics = useMemo(
		() =>
			(categoryAnalyticsData as { categoryAnalytics?: CategoryAnalytics[] })
				?.categoryAnalytics || [],
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

	const handleApplyFilter = useCallback(() => {
		if (dateFilter.startDate || dateFilter.endDate) {
			setIsFiltered(true);
		}
	}, [dateFilter]);

	const handleClearFilter = useCallback(() => {
		setDateFilter({ startDate: '', endDate: '' });
		setIsFiltered(false);
	}, []);

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

	// Format stat values with compact notation for large numbers
	const totalExpenseFormatted = formatNumberWithTooltip(
		summary?.totalAmount || 0,
		{
			currency: primaryCurrency,
			threshold: 100000,
		}
	);
	const avgExpenseFormatted = formatNumberWithTooltip(
		summary?.averageExpense || 0,
		{
			currency: primaryCurrency,
			threshold: 100000,
		}
	);
	const totalCountFormatted = formatNumberWithTooltip(summary?.totalCount || 0);

	const stats = [
		{
			title: 'Total Expenses',
			value: hasMixedCurrencies
				? `${totalExpenseFormatted.compact} *`
				: totalExpenseFormatted.compact,
			fullValue: hasMixedCurrencies
				? `${totalExpenseFormatted.full} *`
				: totalExpenseFormatted.full,
			icon: Wallet,
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
			value: totalCountFormatted.compact,
			fullValue: totalCountFormatted.full,
			icon: Calculator,
			iconBg: 'bg-green-100',
			iconColor: 'text-green-600',
		},
		{
			title: 'Average Expense',
			value: hasMixedCurrencies
				? `${avgExpenseFormatted.compact} *`
				: avgExpenseFormatted.compact,
			fullValue: hasMixedCurrencies
				? `${avgExpenseFormatted.full} *`
				: avgExpenseFormatted.full,
			icon: BarChart3,
			iconBg: 'bg-orange-100',
			iconColor: 'text-orange-600',
		},
		{
			title: 'Categories',
			value: Object.keys(summary?.categoryBreakdown || {}).length,
			icon: Tags,
			iconBg: 'bg-purple-100',
			iconColor: 'text-purple-600',
		},
	];

	return (
		<div className="py-6 px-2 sm:px-6 md:container md:mx-auto lg:px-8 min-h-screen">
			<div className="space-y-6">
				{/* Breadcrumb Navigation */}
				<PageBreadcrumb items={[{ label: 'Dashboard' }]} />

				{/* Header */}
				<div
					className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300"
					id="dashboard-header"
				>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
						<p className="text-muted-foreground mt-1">
							Overview of your expenses
						</p>
					</div>
					<Button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 px-3 py-2 sm:px-4"
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
					</Button>
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
					className="animate-in fade-in slide-in-from-top-4 duration-300 relative"
					style={{ animationDelay: '100ms' }}
					id="date-filter"
				>
					{isFetching && (
						<div className="absolute top-2 right-2 z-10">
							<div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md border">
								<svg
									className="animate-spin h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								<span>Updating...</span>
							</div>
						</div>
					)}
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
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{stats.map((stat, index) => (
						<StatCard key={stat.title} {...stat} index={index} />
					))}
				</div>

				{/* Primary Charts */}
				<div className="grid gap-4 md:grid-cols-2" id="primary-charts">
					<Suspense fallback={<ChartSkeleton />}>
						<MonthlyTrendsChart
							data={monthlyTrends}
							primaryCurrency={primaryCurrency}
						/>
					</Suspense>
					<Suspense fallback={<ChartSkeleton />}>
						<CategoryBreakdownChart
							data={categoryData}
							primaryCurrency={primaryCurrency}
						/>
					</Suspense>
				</div>

				{/* Additional Charts */}
				<div className="grid gap-4 md:grid-cols-2" id="trend-charts">
					<Suspense fallback={<ChartSkeleton />}>
						<ExpenseTrendChart
							data={monthlyTrends}
							primaryCurrency={primaryCurrency}
						/>
					</Suspense>
					<Suspense fallback={<ChartSkeleton />}>
						<TopCategoriesChart
							data={topCategories}
							primaryCurrency={primaryCurrency}
						/>
					</Suspense>
				</div>

				{/* Category Analytics Table */}
				<div id="category-analytics">
					<CategoryAnalyticsTable
						data={categoryAnalytics}
						primaryCurrency={primaryCurrency}
					/>
				</div>

				{/* Recent Expenses */}
				<div id="recent-expenses">
					<RecentExpensesList
						expenses={recentExpenses}
						formatCurrency={formatCurrency}
						formatDate={formatDate}
					/>
				</div>

				{/* Expense Modal */}
				{isModalOpen && isDesktop && (
					<ExpenseDrawer
						isOpen={isModalOpen}
						expense={null}
						onClose={() => setIsModalOpen(false)}
						onSuccess={() => {
							setIsModalOpen(false);
							navigate('/expenses');
						}}
					/>
				)}

				{isModalOpen && !isDesktop && (
					<ExpenseDialog
						isOpen={isModalOpen}
						expense={null}
						onClose={() => setIsModalOpen(false)}
						onSuccess={() => {
							setIsModalOpen(false);
							navigate('/expenses');
						}}
					/>
				)}
				<button
					onClick={() => setIsModalOpen(true)}
					className="md:hidden fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
					aria-label="Add expense"
				>
					<Plus className="h-6 w-6" />
				</button>
			</div>
		</div>
	);
};
