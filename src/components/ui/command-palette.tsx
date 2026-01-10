import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
	CreditCard,
	Settings,
	User,
	Home,
	Package,
	Plus,
	Download,
	Filter,
	TrendingUp,
} from 'lucide-react';

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';

interface CommandPaletteProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddExpense?: () => void;
	onExport?: () => void;
}

export function CommandPalette({
	open,
	onOpenChange,
	onAddExpense,
	onExport,
}: CommandPaletteProps) {
	const navigate = useNavigate();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				onOpenChange(!open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, [open, onOpenChange]);

	const runCommand = React.useCallback(
		(command: () => void) => {
			onOpenChange(false);
			command();
		},
		[onOpenChange]
	);

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Navigation">
					<CommandItem
						onSelect={() => runCommand(() => navigate('/dashboard'))}
					>
						<Home className="mr-2 h-4 w-4" />
						<span>Dashboard</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => navigate('/expenses'))}>
						<CreditCard className="mr-2 h-4 w-4" />
						<span>Expenses</span>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => navigate('/categories'))}
					>
						<Package className="mr-2 h-4 w-4" />
						<span>Categories</span>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => navigate('/analytics'))}
					>
						<TrendingUp className="mr-2 h-4 w-4" />
						<span>Analytics</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => navigate('/profile'))}>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Actions">
					{onAddExpense && (
						<CommandItem onSelect={() => runCommand(onAddExpense)}>
							<Plus className="mr-2 h-4 w-4" />
							<span>Add New Expense</span>
						</CommandItem>
					)}
					{onExport && (
						<CommandItem onSelect={() => runCommand(onExport)}>
							<Download className="mr-2 h-4 w-4" />
							<span>Export Data</span>
						</CommandItem>
					)}
					<CommandItem
						onSelect={() =>
							runCommand(() => {
								// Trigger filter toggle if on expenses page
								const filterToggle = document.querySelector(
									'[data-filter-toggle]'
								) as HTMLButtonElement;
								if (filterToggle) filterToggle.click();
							})
						}
					>
						<Filter className="mr-2 h-4 w-4" />
						<span>Toggle Filters</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Settings">
					<CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
