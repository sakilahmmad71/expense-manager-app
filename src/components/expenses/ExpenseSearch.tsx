import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

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
	const [isQuickFiltersOpen, setIsQuickFiltersOpen] = useState(false);

	return (
		<Card>
			<CardContent className="p-3 sm:p-4 space-y-3">
				{/* Compact Search Bar */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search expenses..."
						value={searchQuery}
						onChange={e => onSearchChange(e.target.value)}
						className="pl-10 pr-10 h-10 text-sm"
					/>
					{searchQuery && (
						<button
							onClick={() => onSearchChange('')}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							aria-label="Clear search"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				{/* Quick Date Filters */}
				<div>
					{/* Quick Filters Header - Mobile Only */}
					<div className="flex items-center justify-between mb-2">
						<p className="text-xs font-medium text-gray-600">Quick Filters</p>
						<button
							onClick={() => setIsQuickFiltersOpen(!isQuickFiltersOpen)}
							className="md:hidden p-1 hover:bg-accent rounded-md transition-colors"
							aria-label={
								isQuickFiltersOpen
									? 'Collapse quick filters'
									: 'Expand quick filters'
							}
						>
							{isQuickFiltersOpen ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</button>
					</div>

					{/* Quick Filter Buttons - Collapsible on Mobile */}
					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out md:!block ${
							isQuickFiltersOpen
								? 'max-h-[500px] opacity-100'
								: 'max-h-0 opacity-0 md:opacity-100 md:max-h-full'
						}`}
					>
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
