'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps {
	dateRange?: DateRange;
	onSelect?: (range: DateRange | undefined) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
}

export function DateRangePicker({
	dateRange,
	onSelect,
	disabled,
	placeholder = 'Pick a date range',
	className,
}: DateRangePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'w-full justify-start text-left font-normal',
						!dateRange && 'text-muted-foreground',
						className
					)}
					disabled={disabled}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{dateRange?.from ? (
						dateRange.to ? (
							<>
								{format(dateRange.from, 'LLL dd, y')} -{' '}
								{format(dateRange.to, 'LLL dd, y')}
							</>
						) : (
							format(dateRange.from, 'LLL dd, y')
						)
					) : (
						<span>{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="range"
					selected={dateRange}
					onSelect={onSelect}
					initialFocus
					numberOfMonths={2}
					disabled={disabled}
					captionLayout="dropdown"
					fromYear={2020}
					toYear={new Date().getFullYear() + 1}
				/>
			</PopoverContent>
		</Popover>
	);
}
