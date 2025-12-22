export const DashboardSkeleton = () => {
	return (
		<div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
			<div className="space-y-6 animate-in fade-in duration-300">
				{/* Header skeleton */}
				<div className="space-y-2">
					<div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
					<div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
				</div>

				{/* Stats Grid skeleton */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="h-32 bg-gray-200 rounded-lg animate-pulse"
						/>
					))}
				</div>

				{/* Charts Grid 1 skeleton */}
				<div className="grid gap-4 md:grid-cols-2">
					<div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
					<div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
				</div>

				{/* Charts Grid 2 skeleton */}
				<div className="grid gap-4 md:grid-cols-2">
					<div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
					<div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
				</div>

				{/* Category Analytics Table skeleton */}
				<div className="h-64 bg-gray-200 rounded-lg animate-pulse" />

				{/* Recent Expenses skeleton */}
				<div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
			</div>
		</div>
	);
};
