export const DashboardSkeleton = () => {
	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			<div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
				))}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
				<div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
			</div>
		</div>
	);
};
