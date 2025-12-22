import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface MonthlyTrendsChartProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any[];
	primaryCurrency: string;
	formatCurrency: (value: number, currency: string) => string;
}

export const MonthlyTrendsChart = ({
	data,
	primaryCurrency,
	formatCurrency,
}: MonthlyTrendsChartProps) => {
	return (
		<Card className="transition-shadow duration-300 hover:shadow-lg">
			<CardHeader>
				<CardTitle className="text-base sm:text-lg">Monthly Trends</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={data}>
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
	);
};
