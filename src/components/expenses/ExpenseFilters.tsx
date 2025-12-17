import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Category } from '@/lib/services';
import { Filter } from 'lucide-react';

interface MonthFilter {
	startMonth: string;
	endMonth: string;
}

interface Filters {
	category: string;
	startDate: string;
	endDate: string;
	page: number;
	limit: number;
}

interface ExpenseFiltersProps {
	monthFilter: MonthFilter;
	filters: Filters;
	categories: Category[];
	monthOptions: { value: string; label: string }[];
	sortBy: 'date' | 'amount' | 'category';
	sortOrder: 'asc' | 'desc';
	onMonthFilterChange: (filter: MonthFilter) => void;
	onFiltersChange: (filters: Filters) => void;
	onSortChange: (
		by: 'date' | 'amount' | 'category',
		order: 'asc' | 'desc'
	) => void;
	onClearFilters: () => void;
}

export const ExpenseFilters = ({
	monthFilter,
	filters,
	categories,
	monthOptions,
	sortBy,
	sortOrder,
	onMonthFilterChange,
	onFiltersChange,
	onSortChange,
	onClearFilters,
}: ExpenseFiltersProps) => {
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-base">
						<Filter className="h-4 w-4" />
						Filters
					</CardTitle>
					{(filters.category ||
						monthFilter.startMonth ||
						monthFilter.endMonth) && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onClearFilters}
							className="h-8 text-xs"
						>
							Clear
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-3 pt-0">
				{/* Compact Filter Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					{/* Month Start */}
					<div className="space-y-1.5">
						<Label className="text-xs sm:text-sm text-muted-foreground">
							Month
						</Label>
						<Select
							value={monthFilter.startMonth || undefined}
							onValueChange={value => {
								onMonthFilterChange({ ...monthFilter, startMonth: value });
							}}
						>
							<SelectTrigger className="h-10 text-sm">
								<SelectValue placeholder="Select month" />
							</SelectTrigger>
							<SelectContent>
								{monthOptions.map(month => (
									<SelectItem key={month.value} value={month.value}>
										{month.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Month End (Range) */}
					<div className="space-y-1.5">
						<Label className="text-xs sm:text-sm text-muted-foreground">
							To Month
						</Label>
						<Select
							value={monthFilter.endMonth || undefined}
							onValueChange={value => {
								onMonthFilterChange({ ...monthFilter, endMonth: value });
							}}
						>
							<SelectTrigger className="h-10 text-sm">
								<SelectValue placeholder="End (optional)" />
							</SelectTrigger>
							<SelectContent>
								{monthOptions.map(month => (
									<SelectItem key={month.value} value={month.value}>
										{month.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Category Filter */}
					<div className="space-y-1.5">
						<Label className="text-xs sm:text-sm text-muted-foreground">
							Category
						</Label>
						<Select
							value={filters.category || undefined}
							onValueChange={value =>
								onFiltersChange({ ...filters, category: value, page: 1 })
							}
						>
							<SelectTrigger className="h-10 text-sm">
								<SelectValue placeholder="All" />
							</SelectTrigger>
							<SelectContent>
								{categories.map(category => (
									<SelectItem key={category.id} value={category.id}>
										<span className="flex items-center gap-2">
											{category.icon && <span>{category.icon}</span>}
											{category.name}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Sort Filter */}
					<div className="space-y-1.5">
						<Label className="text-xs sm:text-sm text-muted-foreground">
							Sort By
						</Label>
						<Select
							value={`${sortBy}-${sortOrder}`}
							onValueChange={value => {
								const [by, order] = value.split('-') as [
									'date' | 'amount' | 'category',
									'asc' | 'desc',
								];
								onSortChange(by, order);
							}}
						>
							<SelectTrigger className="h-10 text-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="date-desc">Date ↓</SelectItem>
								<SelectItem value="date-asc">Date ↑</SelectItem>
								<SelectItem value="amount-desc">Amount ↓</SelectItem>
								<SelectItem value="amount-asc">Amount ↑</SelectItem>
								<SelectItem value="category-asc">Category A-Z</SelectItem>
								<SelectItem value="category-desc">Category Z-A</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Custom Date Range - Compact */}
				{(filters.startDate || filters.endDate) && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t">
						<div className="space-y-1.5">
							<Label
								htmlFor="startDate"
								className="text-xs sm:text-sm text-muted-foreground"
							>
								Start Date
							</Label>
							<Input
								id="startDate"
								type="date"
								value={filters.startDate}
								onChange={e => {
									onFiltersChange({
										...filters,
										startDate: e.target.value,
										page: 1,
									});
								}}
								className="h-10"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor="endDate"
								className="text-xs sm:text-sm text-muted-foreground"
							>
								End Date
							</Label>
							<Input
								id="endDate"
								type="date"
								value={filters.endDate}
								onChange={e => {
									onFiltersChange({
										...filters,
										endDate: e.target.value,
										page: 1,
									});
								}}
								className="h-10"
							/>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
