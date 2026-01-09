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
import { ChevronDown, ChevronUp, Calendar, Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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
}: ExpenseFiltersProps) => {
	// Track which accordion sections are open
	const [openSections, setOpenSections] = useState<string[]>(['basic']);

	// Auto-expand custom date range when month filters are selected
	useEffect(() => {
		if (monthFilter.startMonth || monthFilter.endMonth) {
			setOpenSections(prev => {
				if (!prev.includes('custom')) {
					return [...prev, 'custom'];
				}
				return prev;
			});
		}
	}, [monthFilter.startMonth, monthFilter.endMonth]);

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
			<CardHeader className="pb-3 md:pb-4">
				<div className="flex items-center justify-between gap-3">
					{/* Filter Title and Icon */}
					<button
						onClick={onToggle}
						className="flex items-center gap-2 text-base font-semibold hover:text-primary transition-colors md:cursor-default md:pointer-events-none"
					>
						<Filter className="h-4 w-4 flex-shrink-0" />
						<span>Filters</span>
					</button>

					{/* Action Buttons */}
					<div className="flex items-center gap-2">
						{activeFilterCount > 0 && (
							<Button
								variant="outline"
								size="sm"
								onClick={onClearFilters}
								className="h-8 text-xs gap-1 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
							>
								<X className="h-3 w-3" />
								<span className="hidden sm:inline">Clear All</span>
							</Button>
						)}
						<button
							onClick={onToggle}
							className="md:hidden p-1.5 hover:bg-accent rounded-md transition-colors"
							aria-label={isOpen ? 'Collapse filters' : 'Expand filters'}
						>
							{isOpen ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</button>
					</div>
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
						value={openSections}
						onValueChange={setOpenSections}
						className="w-full"
					>
						{/* Basic Filters */}
						<AccordionItem value="basic" className="border-b-0">
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

						{/* Custom Date Range - Only show when month filters are active */}
						{(monthFilter.startMonth || monthFilter.endMonth) && (
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
