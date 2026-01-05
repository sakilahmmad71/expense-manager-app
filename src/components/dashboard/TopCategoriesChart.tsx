import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencySymbol } from '@/lib/utils';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
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

interface TopCategoriesChartProps {
	data: CategoryAnalytics[];
	primaryCurrency: string;
	formatCurrency: (value: number, currency: string) => string;
}

export const TopCategoriesChart = ({
	data,
	primaryCurrency,
	formatCurrency,
}: TopCategoriesChartProps) => {
	return (
		<Card className="transition-shadow duration-300 hover:shadow-lg">
			<CardHeader>
				<CardTitle className="text-base sm:text-lg">
					Top 5 Spending Categories
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={data} layout="vertical">
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis type="number" tick={{ fontSize: 12 }} />
						<YAxis
							dataKey="categoryName"
							type="category"
							tick={{ fontSize: 12 }}
							width={100}
						/>
						<Tooltip
							formatter={value => {
								const isMobile = window.innerWidth < 640;
								if (isMobile) {
									const amount = Number(value);
									const symbol = formatCurrencySymbol(primaryCurrency);
									return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
								}
								return formatCurrency(Number(value), primaryCurrency);
							}}
						/>
						<Bar
							dataKey="totalAmount"
							name="Total Amount"
							fill="#10b981"
							animationDuration={800}
						>
							{data.map((_entry, index) => (
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
	);
};
