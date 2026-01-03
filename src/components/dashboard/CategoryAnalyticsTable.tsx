import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatNumberWithTooltip } from '@/lib/formatNumber';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface CategoryAnalytics {
	categoryId: string;
	categoryName: string;
	color?: string;
	icon?: string;
	totalAmount: number;
	count: number;
	averageAmount: number;
}

interface CategoryAnalyticsTableProps {
	data: CategoryAnalytics[];
	primaryCurrency: string;
	initialLimit?: number;
}

export const CategoryAnalyticsTable = ({
	data,
	primaryCurrency,
	initialLimit = 10,
}: CategoryAnalyticsTableProps) => {
	const [showAll, setShowAll] = useState(false);

	if (data.length === 0) return null;

	const displayData = showAll ? data : data.slice(0, initialLimit);
	const hasMore = data.length > initialLimit;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-base sm:text-lg">
					Category Analytics
				</CardTitle>
				{hasMore && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowAll(!showAll)}
						className="text-xs"
					>
						{showAll ? (
							<>
								<ChevronUp className="h-4 w-4 mr-1" />
								Show Less
							</>
						) : (
							<>
								<ChevronDown className="h-4 w-4 mr-1" />
								Show All ({data.length})
							</>
						)}
					</Button>
				)}
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto -mx-4 sm:mx-0">
					<table className="w-full min-w-[500px]">
						<thead>
							<tr className="border-b">
								<th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
									Category
								</th>
								<th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
									Total Amount
								</th>
								<th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
									Count
								</th>
								<th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
									Average
								</th>
							</tr>
						</thead>
						<tbody>
							{displayData.map(item => {
								const totalFormatted = formatNumberWithTooltip(
									item.totalAmount,
									{
										currency: primaryCurrency,
										threshold: 100000,
									}
								);
								const avgFormatted = formatNumberWithTooltip(
									item.averageAmount,
									{
										currency: primaryCurrency,
										threshold: 100000,
									}
								);
								const countFormatted = formatNumberWithTooltip(item.count);

								return (
									<tr
										key={item.categoryId}
										className="border-b last:border-0 hover:bg-gray-50 transition-colors duration-200"
									>
										<td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
											{item.categoryName}
										</td>
										<td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<span className="cursor-help">
															{totalFormatted.compact}
														</span>
													</TooltipTrigger>
													<TooltipContent>
														<p>{totalFormatted.full}</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</td>
										<td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<span className="cursor-help">
															{countFormatted.compact}
														</span>
													</TooltipTrigger>
													<TooltipContent>
														<p>{countFormatted.full}</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</td>
										<td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<span className="cursor-help">
															{avgFormatted.compact}
														</span>
													</TooltipTrigger>
													<TooltipContent>
														<p>{avgFormatted.full}</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
};
