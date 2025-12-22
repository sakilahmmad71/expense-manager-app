import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	iconBg: string;
	iconColor: string;
	trend?: string;
	trendColor?: string;
	index?: number;
}

export const StatCard = ({
	title,
	value,
	icon: Icon,
	iconBg,
	iconColor,
	trend,
	trendColor,
	index = 0,
}: StatCardProps) => {
	return (
		<Card
			className="hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-2"
			style={{
				animationDelay: `${index * 100}ms`,
				animationFillMode: 'backwards',
			}}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
					{title}
				</CardTitle>
				<div className={`p-2 sm:p-3 rounded-xl ${iconBg} shadow-sm`}>
					<Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-xl sm:text-2xl font-bold text-gray-900">
					{value}
				</div>
				{trend && (
					<p className={`text-xs sm:text-sm font-medium mt-1 ${trendColor}`}>
						{trend} vs last month
					</p>
				)}
			</CardContent>
		</Card>
	);
};
