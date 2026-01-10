import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import ReactECharts from 'echarts-for-react';
import echarts from '@/lib/echarts';
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

interface CategoryBreakdownChartProps {
	data: Array<{ name: string; value: number }>;
	primaryCurrency: string;
}

export const CategoryBreakdownChart = ({
	data,
	primaryCurrency,
}: CategoryBreakdownChartProps) => {
	// Process data to show only top 10 categories + "Others"
	const processedData = useMemo(() => {
		if (data.length <= 10) return data;

		// Sort by value descending
		const sorted = [...data].sort((a, b) => b.value - a.value);

		// Take top 10
		const top10 = sorted.slice(0, 10);

		// Sum remaining categories as "Others"
		const others = sorted.slice(10).reduce((sum, item) => sum + item.value, 0);

		if (others > 0) {
			return [...top10, { name: 'Others', value: others }];
		}

		return top10;
	}, [data]);

	const option = useMemo(
		() => ({
			tooltip: {
				trigger: 'item',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				formatter: (params: any) => {
					return `
						<div style="padding: 8px;">
							<div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
							<div style="color: ${params.color};">
								${formatCurrency(params.value, primaryCurrency)}
							</div>
							<div style="color: #6b7280; font-size: 12px; margin-top: 4px;">
								${params.percent}%
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
			legend: {
				orient: 'vertical',
				right: 10,
				top: 'center',
				textStyle: {
					color: '#374151',
					fontSize: 12,
				},
				formatter: (name: string) => {
					// Truncate long names
					return name.length > 15 ? name.substring(0, 15) + '...' : name;
				},
			},
			series: [
				{
					name: 'Category',
					type: 'pie',
					radius: ['45%', '75%'], // Donut chart
					center: ['35%', '50%'],
					avoidLabelOverlap: true,
					itemStyle: {
						borderRadius: 8,
						borderColor: '#fff',
						borderWidth: 2,
					},
					label: {
						show: true,
						position: 'outside',
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						formatter: (params: any) => {
							// Only show label if percentage > 5%
							if (params.percent < 5) return '';
							return `{b|${params.name}}\n{c|${params.percent}%}`;
						},
						rich: {
							b: {
								fontSize: 12,
								fontWeight: 600,
								color: '#374151',
								lineHeight: 18,
							},
							c: {
								fontSize: 11,
								color: '#6b7280',
								lineHeight: 16,
							},
						},
						distanceToLabelLine: 5,
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.2)',
						},
						label: {
							show: true,
							fontSize: 14,
							fontWeight: 'bold',
						},
					},
					labelLine: {
						show: true,
						length: 15,
						length2: 10,
						smooth: true,
					},
					data: processedData.map((item, index) => ({
						name: item.name,
						value: item.value,
						itemStyle: {
							color:
								item.name === 'Others'
									? '#9ca3af' // Gray for "Others"
									: {
											type: 'linear',
											x: 0,
											y: 0,
											x2: 1,
											y2: 1,
											colorStops: [
												{
													offset: 0,
													color:
														GRADIENT_COLORS[index % GRADIENT_COLORS.length][0],
												},
												{
													offset: 1,
													color:
														GRADIENT_COLORS[index % GRADIENT_COLORS.length][1],
												},
											],
										},
						},
					})),
					animationType: 'scale',
					animationEasing: 'elasticOut',
					animationDuration: 1000,
				},
			],
		}),
		[processedData, primaryCurrency]
	);

	return (
		<Card className="transition-shadow duration-300 hover:shadow-lg">
			<CardHeader>
				<CardTitle className="text-base sm:text-lg">
					Category Breakdown
				</CardTitle>
				{data.length > 10 && (
					<p className="text-sm text-muted-foreground mt-1">
						Showing top 10 of {data.length} categories
					</p>
				)}
			</CardHeader>
			<CardContent>
				<ReactECharts
					echarts={echarts}
					option={option}
					style={{ height: '300px', width: '100%' }}
					opts={{ renderer: 'canvas' }}
				/>
			</CardContent>
		</Card>
	);
};
