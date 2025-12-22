import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
	formatCurrency: (value: number, currency: string) => string;
}

export const CategoryAnalyticsTable = ({
	data,
	primaryCurrency,
	formatCurrency,
}: CategoryAnalyticsTableProps) => {
	if (data.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base sm:text-lg">
					Category Analytics
				</CardTitle>
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
							{data.map(item => (
								<tr
									key={item.categoryId}
									className="border-b last:border-0 hover:bg-gray-50 transition-colors duration-200"
								>
									<td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
										{item.categoryName}
									</td>
									<td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
										{formatCurrency(item.totalAmount, primaryCurrency)}
									</td>
									<td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
										{item.count}
									</td>
									<td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
										{formatCurrency(item.averageAmount, primaryCurrency)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
};
