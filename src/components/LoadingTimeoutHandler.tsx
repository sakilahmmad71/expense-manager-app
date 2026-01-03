import { useEffect, useState } from 'react';
import { Loader2, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';

interface LoadingTimeoutHandlerProps {
	isLoading: boolean;
	timeout?: number; // in milliseconds
	showProgress?: boolean;
	message?: string;
	children?: React.ReactNode;
}

export const LoadingTimeoutHandler = ({
	isLoading,
	timeout = 30000, // 30 seconds default
	showProgress = true,
	message = 'Loading data...',
	children,
}: LoadingTimeoutHandlerProps) => {
	const [elapsedTime, setElapsedTime] = useState(0);
	const [showWarning, setShowWarning] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			setElapsedTime(0);
			setShowWarning(false);
			return;
		}

		const startTime = Date.now();
		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			setElapsedTime(elapsed);

			// Show warning at 50% of timeout
			if (elapsed >= timeout * 0.5 && !showWarning) {
				setShowWarning(true);
			}
		}, 100);

		return () => clearInterval(interval);
	}, [isLoading, timeout, showWarning]);

	if (!isLoading) {
		return <>{children}</>;
	}

	const progress = Math.min((elapsedTime / timeout) * 100, 100);
	const isNearTimeout = elapsedTime >= timeout * 0.5;

	return (
		<div className="min-h-[400px] flex items-center justify-center p-4">
			<Card className="w-full max-w-md border-blue-200 shadow-lg">
				<CardContent className="p-6 space-y-4">
					<div className="flex flex-col items-center space-y-4">
						<div
							className={`h-16 w-16 rounded-full flex items-center justify-center ${
								isNearTimeout ? 'bg-orange-100 animate-pulse' : 'bg-blue-100'
							}`}
						>
							{isNearTimeout ? (
								<Clock className="h-8 w-8 text-orange-600 animate-bounce" />
							) : (
								<Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
							)}
						</div>

						<div className="text-center space-y-2">
							<h3 className="text-lg font-semibold text-gray-900">
								{isNearTimeout
									? 'This is taking longer than usual...'
									: message}
							</h3>
							<p className="text-sm text-gray-600">
								{isNearTimeout
									? 'Processing large dataset. Please wait...'
									: 'Please wait while we fetch your data'}
							</p>
						</div>

						{showProgress && (
							<div className="w-full space-y-2">
								<Progress value={progress} className="h-2" />
								<p className="text-xs text-center text-gray-500">
									{(elapsedTime / 1000).toFixed(1)}s elapsed
									{isNearTimeout && ' • Large dataset detected'}
								</p>
							</div>
						)}

						{showWarning && (
							<div className="bg-orange-50 border border-orange-200 rounded-lg p-3 w-full">
								<p className="text-xs text-orange-800">
									<strong>Tip:</strong> You're working with a large dataset.
									Consider using filters to reduce the amount of data loaded.
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
