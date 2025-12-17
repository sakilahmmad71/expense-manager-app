import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboardAPI, DashboardSummary, Expense } from '@/lib/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
	Calendar,
	FolderKanban,
	PiggyBank,
	Receipt,
	RefreshCw,
	TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const COLORS = [
	'#3b82f6',
	'#10b981',
	'#f59e0b',
	'#ef4444',
	'#8b5cf6',
	'#ec4899',
	'#14b8a6',
	'#f97316',
];

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
	const [summary, setSummary] = useState<DashboardSummary | null>(null);
	const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
	const [categoryAnalytics, setCategoryAnalytics] = useState<
		CategoryAnalytics[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
	const [isFiltered, setIsFiltered] = useState(false);
	const [hasMixedCurrencies, setHasMixedCurrencies] = useState(false);
	const [primaryCurrency, setPrimaryCurrency] = useState('USD');

	const fetchData = async (filters?: {
		startDate?: string;
		endDate?: string;
	}) => {
		setIsLoading(true);
		try {
			const [summaryRes, recentRes, trendsRes, analyticsRes] =
				await Promise.all([
					dashboardAPI.getSummary(filters),
					dashboardAPI.getRecentExpenses({ limit: 5 }),
					dashboardAPI.getMonthlyTrends(),
					dashboardAPI.getCategoryAnalytics(filters),
				]);

			setSummary(summaryRes.data.summary);
			setRecentExpenses(recentRes.data.expenses);
			setMonthlyTrends(trendsRes.data.trends);
			setCategoryAnalytics(analyticsRes.data.categoryAnalytics);

			// Detect mixed currencies and primary currency
			const currencies = new Set(
				recentRes.data.expenses.map((e: Expense) => e.currency)
			);
			setHasMixedCurrencies(currencies.size > 1);
			if (currencies.size > 0) {
				// Use the most common currency or the first one
				const currencyCount = recentRes.data.expenses.reduce(
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
		} catch (error) {
			console.error('Failed to fetch dashboard data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleApplyFilter = () => {
		if (dateFilter.startDate || dateFilter.endDate) {
			fetchData(dateFilter);
			setIsFiltered(true);
		}
	};

	const handleClearFilter = () => {
		setDateFilter({ startDate: '', endDate: '' });
		setIsFiltered(false);
		fetchData();
	};

	if (isLoading) {
		return (
			<div className="space-y-6 animate-in fade-in duration-500">
				<div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="h-32 bg-gray-200 rounded-lg animate-pulse"
						/>
					))}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
					<div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
				</div>
			</div>
		);
	}

	const categoryData = summary?.categoryBreakdown
		? Object.entries(summary.categoryBreakdown).map(([name, value]) => ({
				name,
				value,
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
		.sort((a, b) => b.totalAmount - a.totalAmount)
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
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
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
				<Card className="border-orange-200 bg-orange-50">
					<CardContent className="pt-4">
						<p className="text-sm text-orange-800">
							<span className="font-semibold">* Note:</span> Your expenses use
							multiple currencies. Summary totals are displayed in{' '}
							{primaryCurrency} but may not accurately reflect converted values.
							Individual expenses show their actual currency.
						</p>
					</CardContent>
				</Card>
			)}

			{/* Date Filter */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
						<Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
						Date Range Filter
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1 space-y-2">
							<Label htmlFor="startDate" className="text-sm">
								Start Date
							</Label>
							<Input
								id="startDate"
								type="date"
								value={dateFilter.startDate}
								onChange={e =>
									setDateFilter({ ...dateFilter, startDate: e.target.value })
								}
								className="h-10"
							/>
						</div>
						<div className="flex-1 space-y-2">
							<Label htmlFor="endDate" className="text-sm">
								End Date
							</Label>
							<Input
								id="endDate"
								type="date"
								value={dateFilter.endDate}
								onChange={e =>
									setDateFilter({ ...dateFilter, endDate: e.target.value })
								}
								className="h-10"
							/>
						</div>
						<div className="flex items-end gap-2">
							<Button
								onClick={handleApplyFilter}
								disabled={isLoading}
								size="sm"
								className="text-xs sm:text-sm"
							>
								Apply Filter
							</Button>
							{isFiltered && (
								<Button
									onClick={handleClearFilter}
									variant="outline"
									disabled={isLoading}
									size="sm"
									className="h-9 w-9 p-0"
								>
									<RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, index) => (
					<Card
						key={stat.title}
						className="hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-2"
						style={{
							animationDelay: `${index * 100}ms`,
							animationFillMode: 'backwards',
						}}
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
								{stat.title}
							</CardTitle>
							<div className={`p-2 sm:p-3 rounded-xl ${stat.iconBg} shadow-sm`}>
								<stat.icon
									className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`}
								/>
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-gray-900">
								{stat.value}
							</div>{' '}
							{stat.trend && (
								<p
									className={`text-xs sm:text-sm font-medium mt-1 ${stat.trendColor}`}
								>
									{stat.trend} vs last month
								</p>
							)}{' '}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Monthly Trends */}
				<Card className="transition-shadow duration-300 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="text-base sm:text-lg">
							Monthly Trends
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={monthlyTrends}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
								<YAxis tick={{ fontSize: 12 }} />
								<Tooltip
									formatter={value =>
										formatCurrency(Number(value), primaryCurrency)
									}
								/>
								<Bar
									dataKey="totalAmount"
									name="Total Amount"
									fill="#3b82f6"
									animationDuration={800}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Category Breakdown */}
				<Card className="transition-shadow duration-300 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="text-base sm:text-lg">
							Category Breakdown
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={categoryData}
									cx="50%"
									cy="50%"
									labelLine={true}
									label={({
										cx,
										cy,
										midAngle,
										innerRadius,
										outerRadius,
										percent,
										name,
									}) => {
										const RADIAN = Math.PI / 180;
										const radius =
											innerRadius + (outerRadius - innerRadius) * 1.3;
										const x = cx + radius * Math.cos(-midAngle * RADIAN);
										const y = cy + radius * Math.sin(-midAngle * RADIAN);

										if (percent < 0.05) return null; // Hide labels for small slices

										return (
											<text
												x={x}
												y={y}
												fill="#374151"
												textAnchor={x > cx ? 'start' : 'end'}
												dominantBaseline="central"
												className="text-xs sm:text-sm font-medium"
											>
												{`${name} (${(percent * 100).toFixed(0)}%)`}
											</text>
										);
									}}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
									animationDuration={800}
									animationBegin={0}
								>
									{categoryData.map((_entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip
									formatter={value =>
										formatCurrency(Number(value), primaryCurrency)
									}
								/>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Additional Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Expense Trend Line Chart */}
				<Card className="transition-shadow duration-300 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="text-base sm:text-lg">
							Expense Trend
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<AreaChart data={monthlyTrends}>
								<defs>
									<linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
										<stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
								<YAxis tick={{ fontSize: 12 }} />
								<Tooltip
									formatter={value =>
										formatCurrency(Number(value), primaryCurrency)
									}
								/>
								<Area
									type="monotone"
									dataKey="totalAmount"
									name="Total Amount"
									stroke="#3b82f6"
									fillOpacity={1}
									fill="url(#colorTotal)"
									animationDuration={800}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Top 5 Categories */}
				<Card className="transition-shadow duration-300 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="text-base sm:text-lg">
							Top 5 Spending Categories
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={topCategories} layout="vertical">
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis type="number" tick={{ fontSize: 12 }} />
								<YAxis
									dataKey="category"
									type="category"
									tick={{ fontSize: 12 }}
									width={100}
								/>
								<Tooltip
									formatter={value =>
										formatCurrency(Number(value), primaryCurrency)
									}
								/>
								<Bar
									dataKey="totalAmount"
									name="Total Amount"
									fill="#10b981"
									animationDuration={800}
								>
									{topCategories.map((_entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Category Analytics Table */}
			{categoryAnalytics.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base sm:text-lg">
							Category Analytics
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto -mx-4 sm:mx-0">
							<table className="w-full min-w-[500px]">
								<thead>
									<tr className="border-b">
										<th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
											Category
										</th>
										<th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
											Total Amount
										</th>
										<th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
											Count
										</th>
										<th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
											Average
										</th>
									</tr>
								</thead>
								<tbody>
									{categoryAnalytics.map(item => (
										<tr
											key={item.categoryId}
											className="border-b last:border-0 hover:bg-gray-50 transition-colors duration-200"
										>
											<td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
												{item.categoryName}
											</td>
											<td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
												{formatCurrency(item.totalAmount, primaryCurrency)}
											</td>
											<td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
												{item.count}
											</td>
											<td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
												{formatCurrency(item.averageAmount, primaryCurrency)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Recent Expenses */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base sm:text-lg">
						Recent Expenses
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{recentExpenses.length === 0 ? (
							<p className="text-center text-gray-500 py-8 text-sm sm:text-base">
								No expenses yet
							</p>
						) : (
							recentExpenses.map((expense, index) => (
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

									{/* Amount Display */}
									<div className="text-left sm:text-right pl-4 sm:pl-0">
										<p className="text-lg sm:text-xl font-bold whitespace-nowrap">
											{formatCurrency(expense.amount, expense.currency)}
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
