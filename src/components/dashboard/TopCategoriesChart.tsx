import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

const GRADIENT_COLORS = [
	['#60a5fa', '#3b82f6'], // Blue
	['#34d399', '#10b981'], // Green
	['#fbbf24', '#f59e0b'], // Amber
	['#f87171', '#ef4444'], // Red
	['#a78bfa', '#8b5cf6'], // Violet
	['#f472b6', '#ec4899'], // Pink
	['#2dd4bf', '#14b8a6'], // Teal
	['#fb923c', '#f97316'], // Orange
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
}

export const TopCategoriesChart = ({
	data,
	primaryCurrency,
}: TopCategoriesChartProps) => {
	const option = useMemo(
		() => ({
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				formatter: (params: any) => {
					const param = params[0];
					const dataItem = data[param.dataIndex];
					return `
						<div style="padding: 8px; min-width: 180px;">
							<div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">${param.name}</div>
							<div style="color: ${param.color}; font-size: 13px; margin-bottom: 4px;">
								<strong>Total:</strong> ${formatCurrency(param.value, primaryCurrency)}
							</div>
							<div style="color: #6b7280; font-size: 12px; margin-bottom: 2px;">
								<strong>Count:</strong> ${dataItem.count} expenses
							</div>
							<div style="color: #6b7280; font-size: 12px;">
								<strong>Average:</strong> ${formatCurrency(dataItem.averageAmount, primaryCurrency)}
							</div>
						</div>
					`;
				},
				backgroundColor: 'rgba(255, 255, 255, 0.95)',
				borderColor: '#e5e7eb',
				borderWidth: 1,
				textStyle: {
					color: '#374151',
				},
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				top: '5%',
				containLabel: true,
			},
			xAxis: {
				type: 'value',
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: '#6b7280',
					fontSize: 12,
					formatter: (value: number) => {
						if (value >= 1000000000) {
							return (value / 1000000000).toFixed(1) + 'B';
						} else if (value >= 1000000) {
							return (value / 1000000).toFixed(1) + 'M';
						} else if (value >= 10000) {
							return (value / 1000).toFixed(1) + 'K';
						}
						return value.toFixed(0);
					},
				},
				splitLine: {
					lineStyle: {
						color: '#f3f4f6',
						type: 'dashed',
					},
				},
			},
			yAxis: {
				type: 'category',
				data: data.map(d => {
					// Truncate long category names
					const name = d.categoryName;
					return name.length > 20 ? name.substring(0, 18) + '...' : name;
				}),
				axisLine: {
					lineStyle: {
						color: '#e5e7eb',
					},
				},
				axisLabel: {
					color: '#374151',
					fontSize: 12,
					fontWeight: 500,
				},
				axisTick: {
					show: false,
				},
			},
			series: [
				{
					name: 'Total Amount',
					type: 'bar',
					data: data.map((d, index) => ({
						value: d.totalAmount,
						itemStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 1,
								y2: 0,
								colorStops: [
									{
										offset: 0,
										color: GRADIENT_COLORS[index % GRADIENT_COLORS.length][0],
									},
									{
										offset: 1,
										color: GRADIENT_COLORS[index % GRADIENT_COLORS.length][1],
									},
								],
							},
							borderRadius: [0, 4, 4, 0],
						},
					})),
					barWidth: '60%',
					label: {
						show: true,
						position: 'right',
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						formatter: (params: any) => {
							const value = params.value;
							if (value >= 1000000000) {
								return (value / 1000000000).toFixed(1) + 'B';
							} else if (value >= 1000000) {
								return (value / 1000000).toFixed(1) + 'M';
							} else if (value >= 10000) {
								return (value / 1000).toFixed(1) + 'K';
							}
							return value.toFixed(0);
						},
						color: '#6b7280',
						fontSize: 11,
						fontWeight: 600,
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.2)',
						},
					},
					animationDuration: 800,
					animationEasing: 'cubicOut',
				},
			],
		}),
		[data, primaryCurrency]
	);

	return (
		<Card className="transition-shadow duration-300 hover:shadow-lg">
			<CardHeader>
				<CardTitle className="text-base sm:text-lg">
					Top 5 Spending Categories
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ReactECharts
					option={option}
					style={{ height: '300px', width: '100%' }}
					opts={{ renderer: 'canvas' }}
				/>
			</CardContent>
		</Card>
	);
};
