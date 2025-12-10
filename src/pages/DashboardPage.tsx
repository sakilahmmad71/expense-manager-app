import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboardAPI, DashboardSummary, Expense } from '@/lib/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp, Receipt, Calendar, RefreshCw, PiggyBank, FolderKanban } from 'lucide-react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
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
	const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
	const [categoryAnalytics, setCategoryAnalytics] = useState<CategoryAnalytics[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
	const [isFiltered, setIsFiltered] = useState(false);
	const [hasMixedCurrencies, setHasMixedCurrencies] = useState(false);
	const [primaryCurrency, setPrimaryCurrency] = useState('USD');

	const fetchData = async (filters?: { startDate?: string; endDate?: string }) => {
		setIsLoading(true);
		try {
			const [summaryRes, recentRes, trendsRes, analyticsRes] = await Promise.all([
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
			const currencies = new Set(recentRes.data.expenses.map((e: Expense) => e.currency));
			setHasMixedCurrencies(currencies.size > 1);
			if (currencies.size > 0) {
				// Use the most common currency or the first one
				const currencyCount = recentRes.data.expenses.reduce((acc: any, e: Expense) => {
					acc[e.currency] = (acc[e.currency] || 0) + 1;
					return acc;
				}, {});
				const mostCommon = Object.entries(currencyCount).sort((a: any, b: any) => b[1] - a[1])[0];
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
			<div className='space-y-6 animate-in fade-in duration-500'>
				<div className='h-20 bg-gray-200 rounded-lg animate-pulse' />
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					{[...Array(4)].map((_, i) => (
						<div key={i} className='h-32 bg-gray-200 rounded-lg animate-pulse' />
					))}
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					<div className='h-80 bg-gray-200 rounded-lg animate-pulse' />
					<div className='h-80 bg-gray-200 rounded-lg animate-pulse' />
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

	const stats = [
		{
			title: 'Total Expenses',
			value: hasMixedCurrencies
				? `${formatCurrency(summary?.totalAmount || 0, primaryCurrency)} *`
				: formatCurrency(summary?.totalAmount || 0, primaryCurrency),
			icon: PiggyBank,
			iconBg: 'bg-blue-100',
			iconColor: 'text-blue-600',
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
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>Dashboard</h1>
					<p className='text-sm sm:text-base text-gray-600'>Overview of your expenses</p>
				</div>
			</div>

			{/* Mixed Currency Warning */}
			{hasMixedCurrencies && (
				<Card className='border-orange-200 bg-orange-50'>
					<CardContent className='pt-4'>
						<p className='text-sm text-orange-800'>
							<span className='font-semibold'>* Note:</span> Your expenses use multiple currencies.
							Summary totals are displayed in {primaryCurrency} but may not accurately reflect
							converted values. Individual expenses show their actual currency.
						</p>
					</CardContent>
				</Card>
			)}

			{/* Date Filter */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
						<Calendar className='h-4 w-4 sm:h-5 sm:w-5' />
						Date Range Filter
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='flex-1 space-y-2'>
							<Label htmlFor='startDate' className='text-xs sm:text-sm'>
								Start Date
							</Label>
							<Input
								id='startDate'
								type='date'
								value={dateFilter.startDate}
								onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
							/>
						</div>
						<div className='flex-1 space-y-2'>
							<Label htmlFor='endDate' className='text-xs sm:text-sm'>
								End Date
							</Label>
							<Input
								id='endDate'
								type='date'
								value={dateFilter.endDate}
								onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
							/>
						</div>
						<div className='flex items-end gap-2'>
							<Button
								onClick={handleApplyFilter}
								disabled={isLoading}
								size='sm'
								className='text-xs sm:text-sm'>
								Apply Filter
							</Button>
							{isFiltered && (
								<Button
									onClick={handleClearFilter}
									variant='outline'
									disabled={isLoading}
									size='sm'
									className='h-9 w-9 p-0'>
									<RefreshCw className='h-3 w-3 sm:h-4 sm:w-4' />
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats Grid */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				{stats.map((stat, index) => (
					<Card
						key={stat.title}
						className='hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-2'
						style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-xs sm:text-sm font-medium text-gray-600'>
								{stat.title}
							</CardTitle>
							<div className={`p-2 sm:p-3 rounded-xl ${stat.iconBg} shadow-sm`}>
								<stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
							</div>
						</CardHeader>
						<CardContent>
							<div className='text-xl sm:text-2xl font-bold text-gray-900'>{stat.value}</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts */}
			<div className='grid gap-4 md:grid-cols-2'>
				{/* Monthly Trends */}
				<Card className='transition-shadow duration-300 hover:shadow-lg'>
					<CardHeader>
						<CardTitle className='text-base sm:text-lg'>Monthly Trends</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={monthlyTrends}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='monthName' tick={{ fontSize: 12 }} />
								<YAxis tick={{ fontSize: 12 }} />
								<Tooltip formatter={(value) => formatCurrency(Number(value), primaryCurrency)} />
								<Bar dataKey='totalAmount' fill='#3b82f6' animationDuration={800} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Category Breakdown */}
				<Card className='transition-shadow duration-300 hover:shadow-lg'>
					<CardHeader>
						<CardTitle className='text-base sm:text-lg'>Category Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width='100%' height={300}>
							<PieChart>
								<Pie
									data={categoryData}
									cx='50%'
									cy='50%'
									labelLine={false}
									label={(entry) => entry.name}
									outerRadius={80}
									fill='#8884d8'
									dataKey='value'
									animationDuration={800}
									animationBegin={0}>
									{categoryData.map((_entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip formatter={(value) => formatCurrency(Number(value), primaryCurrency)} />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Category Analytics Table */}
			{categoryAnalytics.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className='text-base sm:text-lg'>Category Analytics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='overflow-x-auto -mx-4 sm:mx-0'>
							<table className='w-full min-w-[500px]'>
								<thead>
									<tr className='border-b'>
										<th className='text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm'>
											Category
										</th>
										<th className='text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm'>
											Total
										</th>
										<th className='text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm'>
											Count
										</th>
										<th className='text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm'>Avg</th>
									</tr>
								</thead>
								<tbody>
									{categoryAnalytics.map((item) => (
										<tr
											key={item.categoryId}
											className='border-b last:border-0 hover:bg-gray-50 transition-colors duration-200'>
											<td className='py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm'>
												{item.categoryName}
											</td>
											<td className='text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm'>
												{formatCurrency(item.totalAmount, primaryCurrency)}
											</td>
											<td className='text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm'>
												{item.count}
											</td>
											<td className='text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm'>
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
					<CardTitle className='text-base sm:text-lg'>Recent Expenses</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-3 sm:space-y-4'>
						{recentExpenses.length === 0 ? (
							<p className='text-center text-gray-500 py-8 text-sm sm:text-base'>No expenses yet</p>
						) : (
							recentExpenses.map((expense, index) => (
								<div
									key={expense.id}
									className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3 sm:pb-4 last:border-0 hover:bg-gray-50 transition-colors duration-200 rounded-lg p-2 sm:px-2 animate-in fade-in slide-in-from-left-2'
									style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}>
									<div className='min-w-0'>
										<p className='font-medium text-sm sm:text-base truncate'>{expense.title}</p>
										<p className='text-xs sm:text-sm text-gray-500'>
											{expense.category.name} • {formatDate(expense.date)}
										</p>
									</div>
									<div className='text-left sm:text-right flex-shrink-0'>
										<p className='font-semibold text-base sm:text-lg'>
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
