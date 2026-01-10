import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';

interface ModernPaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (limit: number) => void;
	itemsPerPageOptions?: number[];
	className?: string;
}

export function ModernPagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange,
	itemsPerPageOptions = [10, 20, 50, 100],
	className = '',
}: ModernPaginationProps) {
	const [jumpToPage, setJumpToPage] = useState('');

	const handleJumpToPage = () => {
		const pageNum = parseInt(jumpToPage);
		if (pageNum >= 1 && pageNum <= totalPages) {
			onPageChange(pageNum);
			setJumpToPage('');
		}
	};

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 7;

		if (totalPages <= maxVisible) {
			// Show all pages if total is small
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage <= 3) {
				// Near start
				for (let i = 2; i <= 5; i++) {
					pages.push(i);
				}
				pages.push('...');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				// Near end
				pages.push('...');
				for (let i = totalPages - 4; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				// Middle
				pages.push('...');
				pages.push(currentPage - 1);
				pages.push(currentPage);
				pages.push(currentPage + 1);
				pages.push('...');
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	return (
		<div className={`flex flex-col gap-4 ${className}`}>
			{/* Mobile View */}
			<div className="flex flex-col gap-3 sm:hidden">
				<div className="flex items-center justify-between">
					<div className="text-xs text-muted-foreground">
						Showing {startItem}-{endItem} of {totalItems.toLocaleString()}
					</div>
					<Select
						value={itemsPerPage.toString()}
						onValueChange={value => onItemsPerPageChange(parseInt(value))}
					>
						<SelectTrigger className="w-[100px] h-8 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{itemsPerPageOptions.map(option => (
								<SelectItem key={option} value={option.toString()}>
									{option} / page
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center justify-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<div className="text-sm font-medium min-w-[80px] text-center">
						Page {currentPage} of {totalPages}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Desktop View */}
			<div className="hidden sm:flex items-center justify-between gap-4">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>Items per page:</span>
					<Select
						value={itemsPerPage.toString()}
						onValueChange={value => onItemsPerPageChange(parseInt(value))}
					>
						<SelectTrigger className="w-[100px] h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{itemsPerPageOptions.map(option => (
								<SelectItem key={option} value={option.toString()}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className="ml-4">
						Showing {startItem.toLocaleString()}-{endItem.toLocaleString()} of{' '}
						{totalItems.toLocaleString()}
					</span>
				</div>

				<div className="flex items-center gap-2">
					{/* First Page */}
					<Button
						variant="outline"
						size="icon"
						onClick={() => onPageChange(1)}
						disabled={currentPage === 1}
						className="h-9 w-9"
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>

					{/* Previous Page */}
					<Button
						variant="outline"
						size="icon"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="h-9 w-9"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>

					{/* Page Numbers */}
					{getPageNumbers().map((page, index) =>
						page === '...' ? (
							<span
								key={`ellipsis-${index}`}
								className="px-2 text-muted-foreground"
							>
								...
							</span>
						) : (
							<Button
								key={page}
								variant={currentPage === page ? 'default' : 'outline'}
								size="sm"
								onClick={() => onPageChange(page as number)}
								className="h-9 min-w-[36px]"
							>
								{page}
							</Button>
						)
					)}

					{/* Next Page */}
					<Button
						variant="outline"
						size="icon"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="h-9 w-9"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>

					{/* Last Page */}
					<Button
						variant="outline"
						size="icon"
						onClick={() => onPageChange(totalPages)}
						disabled={currentPage === totalPages}
						className="h-9 w-9"
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>

					{/* Jump to Page */}
					{totalPages > 10 && (
						<div className="flex items-center gap-2 ml-4 border-l pl-4">
							<span className="text-sm text-muted-foreground whitespace-nowrap">
								Go to:
							</span>
							<Input
								type="number"
								min={1}
								max={totalPages}
								value={jumpToPage}
								onChange={e => setJumpToPage(e.target.value)}
								onKeyDown={e => e.key === 'Enter' && handleJumpToPage()}
								placeholder="Page"
								className="w-16 h-9 text-sm"
							/>
							<Button
								variant="outline"
								size="sm"
								onClick={handleJumpToPage}
								disabled={!jumpToPage}
								className="h-9"
							>
								Go
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
