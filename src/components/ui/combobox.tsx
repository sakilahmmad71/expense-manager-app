import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface ComboboxOption {
	value: string;
	label: string;
	icon?: string;
}

interface ComboboxProps {
	options: ComboboxOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	emptyText?: string;
	searchPlaceholder?: string;
	disabled?: boolean;
	className?: string;
	// Server-side search props
	searchQuery?: string;
	onSearchChange?: (query: string) => void;
	isLoading?: boolean;
}

export function Combobox({
	options,
	value,
	onValueChange,
	placeholder = 'Select an option...',
	emptyText = 'No option found.',
	searchPlaceholder = 'Search...',
	disabled = false,
	className,
	searchQuery: _searchQuery, // Not used directly - using local state instead
	onSearchChange,
	isLoading = false,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [triggerWidth, setTriggerWidth] = React.useState<number>(0);
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	// Local search state for instant client-side filtering
	const [localSearch, setLocalSearch] = React.useState('');

	// Measure trigger width when it mounts or window resizes
	React.useEffect(() => {
		const updateWidth = () => {
			if (triggerRef.current) {
				setTriggerWidth(triggerRef.current.offsetWidth);
			}
		};

		updateWidth();
		window.addEventListener('resize', updateWidth);
		return () => window.removeEventListener('resize', updateWidth);
	}, []);

	// Handle search input change
	const handleSearchChange = React.useCallback(
		(search: string) => {
			setLocalSearch(search);
			// Call server-side search handler if provided
			onSearchChange?.(search);
		},
		[onSearchChange]
	);

	// Reset local search when popover closes
	React.useEffect(() => {
		if (!open) {
			setLocalSearch('');
		}
	}, [open]);

	const selectedOption = options.find(option => option.value === value);

	return (
		<Popover open={open} onOpenChange={setOpen} modal={false}>
			<PopoverTrigger asChild>
				<Button
					ref={triggerRef}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn('w-full justify-between', className)}
					disabled={disabled}
				>
					{selectedOption ? (
						<span className="flex items-center gap-2">
							{selectedOption.icon && <span>{selectedOption.icon}</span>}
							{selectedOption.label}
						</span>
					) : (
						placeholder
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="p-0 z-[200] max-h-[70vh]"
				align="start"
				style={{ width: triggerWidth > 0 ? `${triggerWidth}px` : 'auto' }}
				onOpenAutoFocus={e => e.preventDefault()}
				onCloseAutoFocus={e => e.preventDefault()}
				sideOffset={8}
				avoidCollisions={true}
				collisionPadding={{ top: 16, right: 16, bottom: 16, left: 16 }}
			>
				<Command shouldFilter={true} className="flex flex-col max-h-[70vh]">
					<CommandInput
						placeholder={searchPlaceholder}
						value={localSearch}
						onValueChange={handleSearchChange}
						className="sticky top-0 z-10 bg-background"
					/>
					<CommandList className="flex-1 overflow-y-auto overscroll-contain">
						{isLoading && (
							<div className="py-6 text-center text-sm text-muted-foreground">
								Searching...
							</div>
						)}
						{!isLoading && (
							<>
								<CommandEmpty>{emptyText}</CommandEmpty>
								<CommandGroup>
									{options.map(option => (
										<CommandItem
											key={option.value}
											value={option.label}
											keywords={[option.label, option.value]}
											onSelect={() => {
												onValueChange?.(option.value);
												setOpen(false);
											}}
										>
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													value === option.value ? 'opacity-100' : 'opacity-0'
												)}
											/>
											<span className="flex items-center gap-2">
												{option.icon && <span>{option.icon}</span>}
												{option.label}
											</span>
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
