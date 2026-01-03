import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

// Enhanced skeleton for expense cards
export const ExpenseCardSkeleton = () => (
	<Card className="mb-2">
		<CardContent className="p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3 flex-1">
					<Skeleton className="h-10 w-10 rounded-full" />
					<div className="space-y-2 flex-1">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				</div>
				<div className="text-right space-y-2">
					<Skeleton className="h-5 w-24 ml-auto" />
					<Skeleton className="h-3 w-16 ml-auto" />
				</div>
			</div>
		</CardContent>
	</Card>
);

// Dashboard stats skeleton
export const StatCardSkeleton = () => (
	<Card>
		<CardContent className="p-6">
			<div className="flex items-center justify-between mb-4">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-10 w-10 rounded-lg" />
			</div>
			<Skeleton className="h-8 w-32 mb-2" />
			<Skeleton className="h-3 w-20" />
		</CardContent>
	</Card>
);

// Chart skeleton
export const ChartSkeleton = () => (
	<Card>
		<CardHeader>
			<Skeleton className="h-6 w-40" />
		</CardHeader>
		<CardContent>
			<div className="space-y-3">
				<Skeleton className="h-48 w-full" />
				<div className="flex gap-4 justify-center">
					<Skeleton className="h-3 w-20" />
					<Skeleton className="h-3 w-20" />
					<Skeleton className="h-3 w-20" />
				</div>
			</div>
		</CardContent>
	</Card>
);

// Category grid skeleton
export const CategoryCardSkeleton = () => (
	<Card className="hover:shadow-lg transition-shadow duration-200">
		<CardContent className="p-6">
			<div className="flex items-center justify-between mb-4">
				<Skeleton className="h-12 w-12 rounded-xl" />
				<Skeleton className="h-6 w-6 rounded" />
			</div>
			<Skeleton className="h-5 w-32 mb-2" />
			<Skeleton className="h-4 w-24" />
		</CardContent>
	</Card>
);

// Table row skeleton
export const TableRowSkeleton = () => (
	<div className="border-b border-gray-200">
		<div className="p-4 flex items-center gap-4">
			<Skeleton className="h-4 w-4" />
			<Skeleton className="h-4 flex-1" />
			<Skeleton className="h-4 w-24" />
			<Skeleton className="h-4 w-32" />
			<Skeleton className="h-4 w-20" />
		</div>
	</div>
);

// Add shimmer animation CSS
if (typeof document !== 'undefined') {
	const style = document.createElement('style');
	style.textContent = `
		@keyframes shimmer {
			0% {
				background-position: -200% 0;
			}
			100% {
				background-position: 200% 0;
			}
		}
	`;
	document.head.appendChild(style);
}
