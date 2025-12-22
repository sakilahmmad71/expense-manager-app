import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

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

interface CategoryBreakdownChartProps {
	data: Array<{ name: string; value: number }>;
	primaryCurrency: string;
	formatCurrency: (value: number, currency: string) => string;
}

export const CategoryBreakdownChart = ({
	data,
	primaryCurrency,
	formatCurrency,
}: CategoryBreakdownChartProps) => {
	return (
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
							data={data}
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
								const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
								const x = cx + radius * Math.cos(-midAngle * RADIAN);
								const y = cy + radius * Math.sin(-midAngle * RADIAN);

								if (percent < 0.05) return null;

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
							{data.map((_entry, index) => (
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
	);
};
