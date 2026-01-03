import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Combobox } from '@/components/ui/combobox';
import { Category } from '@/lib/services';
import { ChevronDown, ChevronUp, Calendar, Filter } from 'lucide-react';

interface MonthFilter {
	startMonth: string;
	endMonth: string;
}

interface Filters {
	category: string;
	startDate: string;
	endDate: string;
	search: string;
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
	isOpen: boolean;
	onToggle: () => void;
	onMonthFilterChange: (filter: MonthFilter) => void;
	onFiltersChange: (filters: Filters) => void;
	onSortChange: (
		by: 'date' | 'amount' | 'category',
		order: 'asc' | 'desc'
	) => void;
	onClearFilters: () => void;
	onDateRangeSelect: (
		range: 'today' | 'week' | 'month' | 'lastMonth' | 'year'
	) => void;
}

export const ExpenseFilters = ({
	monthFilter,
	filters,
	categories,
	monthOptions,
	sortBy,
	sortOrder,
	isOpen,
	onToggle,
	onMonthFilterChange,
	onFiltersChange,
	onSortChange,
	onClearFilters,
	onDateRangeSelect,
}: ExpenseFiltersProps) => {
	// Calculate active filter count
	const activeFilterCount = [
		filters.category,
		monthFilter.startMonth,
		monthFilter.endMonth,
		filters.startDate,
		filters.endDate,
	].filter(Boolean).length;

	return (
		<Card>
			{/* Collapsible Header - visible on all screen sizes */}
			<CardHeader className="pb-3 md:pb-0">
				<div className="flex items-center justify-between">
					<button
						onClick={onToggle}
						className="flex justify-between items-center gap-2 text-base font-semibold hover:text-primary transition-colors md:cursor-default md:pointer-events-none flex-1"
					>
						<div className="flex items-center gap-2 mb-2 md:mb-5">
							<Filter className="h-4 w-4" />
							<span>Filters</span>
						</div>
						<div className="flex items-center gap-2">
							{activeFilterCount > 0 && (
								<span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-bold text-white bg-primary rounded-full">
									{activeFilterCount}
								</span>
							)}
							<span className="md:hidden">
								{isOpen ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</span>
						</div>
					</button>
					{activeFilterCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onClearFilters}
							className="h-8 text-xs"
						>
							Clear All
						</Button>
					)}
				</div>
			</CardHeader>

			{/* Collapsible Content - hidden on mobile by default, always visible on md+ */}
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out md:!block ${
					isOpen
						? 'max-h-[2000px] opacity-100'
						: 'max-h-0 opacity-0 md:opacity-100 md:max-h-full'
				}`}
			>
				<CardContent className="space-y-3 pt-3 md:pt-0">
					<Accordion
						type="multiple"
						defaultValue={['basic', 'quick']}
						className="w-full"
					>
						{/* Basic Filters */}
						<AccordionItem value="basic" className="border-b">
							<AccordionTrigger className="text-sm font-semibold hover:no-underline">
								Basic Filters
							</AccordionTrigger>
							<AccordionContent>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
									{/* Month Start */}
									<div className="space-y-1.5">
										<Label className="text-xs sm:text-sm text-muted-foreground">
											Month
										</Label>
										<Select
											value={monthFilter.startMonth || undefined}
											onValueChange={value => {
												onMonthFilterChange({
													...monthFilter,
													startMonth: value,
												});
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
												onMonthFilterChange({
													...monthFilter,
													endMonth: value,
												});
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
										<Combobox
											options={[
												{ value: '', label: 'All Categories' },
												...categories.map(category => ({
													value: category.id,
													label: category.name,
													icon: category.icon,
												})),
											]}
											value={filters.category || ''}
											onValueChange={value =>
												onFiltersChange({
													...filters,
													category: value,
													page: 1,
												})
											}
											placeholder="All"
											searchPlaceholder="Search categories..."
											emptyText="No category found."
											className="h-10 text-sm"
										/>
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
												<SelectItem value="category-asc">
													Category A-Z
												</SelectItem>
												<SelectItem value="category-desc">
													Category Z-A
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* Quick Date Filters */}
						<AccordionItem value="quick" className="border-b">
							<AccordionTrigger className="text-sm font-semibold hover:no-underline">
								Quick Date Filters
							</AccordionTrigger>
							<AccordionContent>
								<div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
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
							</AccordionContent>
						</AccordionItem>

						{/* Custom Date Range */}
						{(filters.startDate || filters.endDate) && (
							<AccordionItem value="custom" className="border-b-0">
								<AccordionTrigger className="text-sm font-semibold hover:no-underline">
									Custom Date Range
								</AccordionTrigger>
								<AccordionContent>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
										<div className="space-y-1.5">
											<Label
												htmlFor="startDate"
												className="text-xs sm:text-sm text-muted-foreground font-medium"
											>
												Start Date
											</Label>
											<div className="relative">
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
													className="h-10 pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
												/>
												<Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
											</div>
										</div>
										<div className="space-y-1.5">
											<Label
												htmlFor="endDate"
												className="text-xs sm:text-sm text-muted-foreground font-medium"
											>
												End Date
											</Label>
											<div className="relative">
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
													className="h-10 pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
												/>
												<Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						)}
					</Accordion>
				</CardContent>
			</div>
		</Card>
	);
};
