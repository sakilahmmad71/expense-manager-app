import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface ExpenseTrendChartProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any[];
	primaryCurrency: string;
}

export const ExpenseTrendChart = ({
	data,
	primaryCurrency,
}: ExpenseTrendChartProps) => {
	const option = useMemo(
		() => ({
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#6b7280',
					},
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
				boundaryGap: false,
				data: data.map(d => d.monthName),
				axisLine: {
					lineStyle: {
						color: '#e5e7eb',
					},
				},
				axisLabel: {
					color: '#6b7280',
					fontSize: 12,
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
					type: 'line',
					smooth: true,
					showSymbol: true,
					symbol: 'circle',
					symbolSize: 8,
					data: data.map(d => d.totalAmount),
					lineStyle: {
						width: 3,
						color: '#3b82f6',
					},
					itemStyle: {
						color: '#3b82f6',
						borderWidth: 2,
						borderColor: '#fff',
					},
					emphasis: {
						itemStyle: {
							color: '#2563eb',
							borderColor: '#fff',
							borderWidth: 3,
							shadowBlur: 10,
							shadowColor: 'rgba(59, 130, 246, 0.5)',
						},
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: 'rgba(96, 165, 250, 0.4)', // Light blue with transparency
								},
								{
									offset: 0.5,
									color: 'rgba(59, 130, 246, 0.2)',
								},
								{
									offset: 1,
									color: 'rgba(59, 130, 246, 0.05)',
								},
							],
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
				<CardTitle className="text-base sm:text-lg">Expense Trend</CardTitle>
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
