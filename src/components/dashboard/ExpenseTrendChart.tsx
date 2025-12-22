import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface ExpenseTrendChartProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any[];
	primaryCurrency: string;
	formatCurrency: (value: number, currency: string) => string;
}

export const ExpenseTrendChart = ({
	data,
	primaryCurrency,
	formatCurrency,
}: ExpenseTrendChartProps) => {
	return (
		<Card className="transition-shadow duration-300 hover:shadow-lg">
			<CardHeader>
				<CardTitle className="text-base sm:text-lg">Expense Trend</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={data}>
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
	);
};
