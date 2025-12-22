import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface ExpenseSearchProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export const ExpenseSearch = ({
	searchQuery,
	onSearchChange,
}: ExpenseSearchProps) => {
	return (
		<Card>
			<CardContent className="p-3 sm:p-4">
				{/* Compact Search Bar */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search expenses..."
						value={searchQuery}
						onChange={e => onSearchChange(e.target.value)}
						className="pl-10 pr-10 h-10 text-sm"
					/>
					{searchQuery && (
						<button
							onClick={() => onSearchChange('')}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							aria-label="Clear search"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
