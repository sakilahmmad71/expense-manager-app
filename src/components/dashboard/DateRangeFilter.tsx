import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';
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
	// Get today's date
	const today = new Date();

	// Convert string dates to Date objects
	const startDateObj = startDate ? new Date(startDate) : undefined;
	const endDateObj = endDate ? new Date(endDate) : undefined;

	// Handler for start date
	const handleStartDateChange = (date: Date | undefined) => {
		if (date) {
			onStartDateChange(format(date, 'yyyy-MM-dd'));
		} else {
			onStartDateChange('');
		}
	};

	// Handler for end date
	const handleEndDateChange = (date: Date | undefined) => {
		if (date) {
			onEndDateChange(format(date, 'yyyy-MM-dd'));
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
							<span className="md:hidden">
								{isOpen ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</span>
						</div>
					</button>
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
							<Label className="text-sm font-medium">Start Date</Label>
							<DatePicker
								date={startDateObj}
								onSelect={handleStartDateChange}
								disabled={isLoading}
								placeholder="Select start date"
								className="h-10"
								toDate={endDateObj || today}
							/>
						</div>
						<div className="flex-1 space-y-2">
							<Label className="text-sm font-medium">End Date</Label>
							<DatePicker
								date={endDateObj}
								onSelect={handleEndDateChange}
								disabled={isLoading}
								placeholder="Select end date"
								className="h-10"
								fromDate={startDateObj}
								toDate={today}
							/>
						</div>
						<div className="flex items-end gap-2">
							<Button
								onClick={onApplyFilter}
								disabled={isLoading}
								className="h-10 text-xs sm:text-sm"
							>
								Apply Filter
							</Button>
							{isFiltered && (
								<Button
									onClick={onClearFilter}
									variant="outline"
									disabled={isLoading}
									className="h-10 w-10 p-0 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</div>
		</Card>
	);
};
