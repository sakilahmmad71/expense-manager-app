import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const NetworkStatusIndicator = () => {
	const [showOfflineBanner, setShowOfflineBanner] = useState(false);

	useEffect(() => {
		const handleOnline = () => {
			setShowOfflineBanner(false);
		};

		const handleOffline = () => {
			setShowOfflineBanner(true);
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		// Check initial status
		if (!navigator.onLine) {
			setShowOfflineBanner(true);
		}

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	if (!showOfflineBanner) return null;

	return (
		<div
			className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 text-center animate-in slide-in-from-top duration-300"
			role="alert"
			aria-live="assertive"
		>
			<div className="flex items-center justify-center gap-2">
				<WifiOff className="h-4 w-4" />
				<span className="text-sm font-medium">
					You are currently offline. Some features may not be available.
				</span>
			</div>
		</div>
	);
};
