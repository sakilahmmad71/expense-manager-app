'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
	date?: Date;
	onSelect?: (date: Date | undefined) => void;
	disabled?: boolean | ((date: Date) => boolean);
	placeholder?: string;
	className?: string;
	fromDate?: Date;
	toDate?: Date;
	captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
	fromYear?: number;
	toYear?: number;
}

export function DatePicker({
	date,
	onSelect,
	disabled,
	placeholder = 'Pick a date',
	className,
	fromDate,
	toDate,
	captionLayout = 'dropdown',
	fromYear = 2020,
	toYear = new Date().getFullYear() + 1,
}: DatePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'w-full justify-start text-left font-normal',
						!date && 'text-muted-foreground',
						className
					)}
					disabled={typeof disabled === 'boolean' ? disabled : false}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, 'PPP') : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={onSelect}
					initialFocus
					disabled={disabled}
					captionLayout={captionLayout}
					fromDate={fromDate}
					toDate={toDate}
					fromYear={fromYear}
					toYear={toYear}
				/>
			</PopoverContent>
		</Popover>
	);
}
