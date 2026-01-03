import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface DateRangeFilterProps {
	startDate: string;
	endDate: string;
	isFiltered: boolean;
	isLoading: boolean;
	isOpen: boolean;
	onToggle: () => void;
	onStartDateChange: (value: string) => void;
	onEndDateChange: (value: string) => void;
	onApplyFilter: () => void;
	onClearFilter: () => void;
}

export const DateRangeFilter = ({
	startDate,
	endDate,
	isFiltered,
	isLoading,
	isOpen,
	onToggle,
	onStartDateChange,
	onEndDateChange,
	onApplyFilter,
	onClearFilter,
}: DateRangeFilterProps) => {
	// Calculate active filter count
	const activeFilterCount = [startDate, endDate].filter(Boolean).length;

	// Convert string dates to Date objects for DateRangePicker
	const dateRange: DateRange | undefined =
		startDate || endDate
			? {
					from: startDate ? new Date(startDate) : undefined,
					to: endDate ? new Date(endDate) : undefined,
				}
			: undefined;

	// Handle date range selection
	const handleDateRangeChange = (range: DateRange | undefined) => {
		if (range?.from) {
			onStartDateChange(format(range.from, 'yyyy-MM-dd'));
		} else {
			onStartDateChange('');
		}

		if (range?.to) {
			onEndDateChange(format(range.to, 'yyyy-MM-dd'));
		} else {
			onEndDateChange('');
		}
	};

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
							<Calendar className="h-4 w-4" />
							<span>Date Range Filter</span>
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
					{isFiltered && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onClearFilter}
							className="h-8 text-xs"
						>
							Clear
						</Button>
					)}
				</div>
			</CardHeader>

			{/* Collapsible Content - hidden on mobile by default, always visible on md+ */}
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out md:!block ${
					isOpen
						? 'max-h-[500px] opacity-100'
						: 'max-h-0 opacity-0 md:opacity-100 md:max-h-full'
				}`}
			>
				<CardContent className="space-y-3 pt-3 md:pt-0">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1 space-y-2">
							<Label className="text-sm font-medium">Date Range</Label>
							<DateRangePicker
								dateRange={dateRange}
								onSelect={handleDateRangeChange}
								disabled={isLoading}
								placeholder="Select date range"
								className="h-10"
							/>
						</div>
						<div className="flex items-end gap-2">
							<Button
								onClick={onApplyFilter}
								disabled={isLoading}
								size="sm"
								className="text-xs sm:text-sm"
							>
								Apply Filter
							</Button>
							{isFiltered && (
								<Button
									onClick={onClearFilter}
									variant="outline"
									disabled={isLoading}
									size="sm"
									className="h-9 w-9 p-0"
								>
									<RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</div>
		</Card>
	);
};
