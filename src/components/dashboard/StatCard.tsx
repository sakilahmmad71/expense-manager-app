import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
	title: string;
	value: string | number;
	fullValue?: string; // Optional full value for tooltip
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
	fullValue,
	icon: Icon,
	iconBg,
	iconColor,
	trend,
	trendColor,
	index = 0,
}: StatCardProps) => {
	const displayValue = typeof value === 'string' ? value : value.toString();
	const hasTooltip = fullValue && fullValue !== displayValue;

	const valueElement = (
		<div className="text-xl sm:text-2xl font-bold text-gray-900 truncate max-w-full">
			{displayValue}
		</div>
	);

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
				{hasTooltip ? (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>{valueElement}</TooltipTrigger>
							<TooltipContent>
								<p className="font-semibold">{fullValue}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				) : (
					valueElement
				)}
				{trend && (
					<p className={`text-xs sm:text-sm font-medium mt-1 ${trendColor}`}>
						{trend} vs last month
					</p>
				)}
			</CardContent>
		</Card>
	);
};
