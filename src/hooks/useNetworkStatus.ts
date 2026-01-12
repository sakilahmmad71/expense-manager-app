import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook to monitor network status and show user-friendly notifications
 */
export const useNetworkStatus = () => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [wasOffline, setWasOffline] = useState(false);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);

			// Only show "back online" message if user was previously offline
			if (wasOffline) {
				toast.success('Back online', {
					description: 'Your connection has been restored.',
					duration: 3000,
				});
				setWasOffline(false);
			}
		};

		const handleOffline = () => {
			setIsOnline(false);
			setWasOffline(true);

			toast.error('No internet connection', {
				description: 'Some features may not work. Check your connection.',
				duration: Infinity, // Keep showing until online
				id: 'offline-toast', // Prevent duplicate toasts
			});
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, [wasOffline]);

	return isOnline;
};
