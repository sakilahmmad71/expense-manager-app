import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface ExpenseSearchProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onDateRangeSelect: (
		range: 'today' | 'week' | 'month' | 'lastMonth' | 'year'
	) => void;
}

export const ExpenseSearch = ({
	searchQuery,
	onSearchChange,
	onDateRangeSelect,
}: ExpenseSearchProps) => {
	return (
		<Card>
			<CardContent className="p-4 sm:p-5">
				<div className="space-y-3 sm:space-y-4">
					{/* Search Bar */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search expenses by title or description..."
							value={searchQuery}
							onChange={e => onSearchChange(e.target.value)}
							className="pl-10 h-10"
						/>
					</div>

					{/* Quick Date Filters */}
					<div className="space-y-2">
						<Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
							Quick Filters
						</Label>
						<div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => onDateRangeSelect('today')}
								className="h-10 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
							>
								Today
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onDateRangeSelect('week')}
								className="h-10 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
							>
								This Week
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onDateRangeSelect('month')}
								className="h-10 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
							>
								This Month
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onDateRangeSelect('lastMonth')}
								className="h-10 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
							>
								Last Month
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onDateRangeSelect('year')}
								className="h-10 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm col-span-2 sm:col-span-1"
							>
								This Year
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
