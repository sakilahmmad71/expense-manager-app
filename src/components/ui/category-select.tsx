import * as React from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface CategoryOption {
	value: string;
	label: string;
	icon?: string;
}

interface CategorySelectProps {
	options: CategoryOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	onSearchChange?: (query: string) => void;
	isLoading?: boolean;
	onAddNew?: () => void;
}

export function CategorySelect({
	options,
	value,
	onValueChange,
	placeholder = 'Select a category',
	disabled = false,
	className,
	onSearchChange,
	isLoading = false,
	onAddNew,
}: CategorySelectProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState('');

	// Filter options based on search
	const filteredOptions = React.useMemo(() => {
		if (!search) return options;
		const searchLower = search.toLowerCase();
		return options.filter(
			option =>
				option.label.toLowerCase().includes(searchLower) ||
				option.value.toLowerCase().includes(searchLower)
		);
	}, [options, search]);

	// Handle search change
	const handleSearchChange = React.useCallback(
		(value: string) => {
			setSearch(value);
			onSearchChange?.(value);
		},
		[onSearchChange]
	);

	// Reset search when closed
	React.useEffect(() => {
		if (!open) {
			setSearch('');
		}
	}, [open]);

	// Find selected option
	const selectedOption = options.find(option => option.value === value);

	return (
		<Select
			open={open}
			onOpenChange={setOpen}
			value={value}
			onValueChange={onValueChange}
			disabled={disabled}
		>
			<SelectTrigger className={cn('w-full', className)}>
				<SelectValue>
					{selectedOption ? (
						<div className="flex items-center gap-2">
							{selectedOption.icon && (
								<span className="text-lg">{selectedOption.icon}</span>
							)}
							<span>{selectedOption.label}</span>
						</div>
					) : (
						<span className="text-muted-foreground">{placeholder}</span>
					)}
				</SelectValue>
			</SelectTrigger>
			<SelectContent
				className="p-0 max-h-[400px]"
				position="popper"
				sideOffset={4}
				align="start"
			>
				<div className="flex flex-col w-full max-h-[400px]">
					{/* Search Input */}
					<div className="p-2 border-b sticky top-0 bg-background z-10">
						<div className="relative">
							<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search categories..."
								value={search}
								onChange={e => handleSearchChange(e.target.value)}
								className="pl-8 h-9"
								autoFocus={false}
								onClick={e => e.stopPropagation()}
							/>
						</div>
					</div>

					{/* Options List */}
					<div className="overflow-y-auto max-h-[280px] overscroll-contain">
						<div className="p-1">
							{isLoading ? (
								<div className="py-6 text-center text-sm text-muted-foreground">
									Loading categories...
								</div>
							) : filteredOptions.length === 0 ? (
								<div className="py-6 text-center text-sm text-muted-foreground">
									No category found
								</div>
							) : (
								filteredOptions.map(option => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="cursor-pointer"
									>
										<div className="flex items-center gap-2">
											{option.icon && (
												<span className="text-lg">{option.icon}</span>
											)}
											<span>{option.label}</span>
										</div>
									</SelectItem>
								))
							)}
						</div>
					</div>
					{/* Add New Category Button */}
					{onAddNew && (
						<div className="p-2 border-t sticky bottom-0 bg-background">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={e => {
									e.stopPropagation();
									setOpen(false);
									onAddNew();
								}}
								className="w-full justify-start text-sm font-normal text-primary hover:text-primary hover:bg-primary/10"
							>
								<Plus className="h-4 w-4 mr-2" />
								Add New Category
							</Button>
						</div>
					)}
				</div>
			</SelectContent>
		</Select>
	);
}
