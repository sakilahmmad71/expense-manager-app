import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface MonthlyTrendsChartProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any[];
	primaryCurrency: string;
}

export const MonthlyTrendsChart = ({
	data,
	primaryCurrency,
}: MonthlyTrendsChartProps) => {
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
					return `
						<div style="padding: 8px;">
							<div style="font-weight: 600; margin-bottom: 4px;">${param.name}</div>
							<div style="color: #3b82f6;">
								${formatCurrency(param.value, primaryCurrency)}
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
				top: '10%',
				containLabel: true,
			},
			xAxis: {
				type: 'category',
				data: data.map(d => d.monthName),
				axisLine: {
					lineStyle: {
						color: '#e5e7eb',
					},
				},
				axisLabel: {
					color: '#6b7280',
					fontSize: 12,
					rotate: 0,
				},
			},
			yAxis: {
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
			series: [
				{
					name: 'Total Amount',
					type: 'bar',
					data: data.map(d => d.totalAmount),
					barWidth: '50%',
					itemStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: '#60a5fa', // Light blue
								},
								{
									offset: 1,
									color: '#3b82f6', // Blue
								},
							],
						},
						borderRadius: [4, 4, 0, 0],
					},
					emphasis: {
						itemStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: '#3b82f6',
									},
									{
										offset: 1,
										color: '#2563eb',
									},
								],
							},
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
				<CardTitle className="text-base sm:text-lg">Monthly Trends</CardTitle>
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
