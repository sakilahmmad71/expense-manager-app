// Service Worker Registration and Management

interface NavigatorStandalone extends Navigator {
	standalone?: boolean;
}

export const registerServiceWorker = async () => {
	if (!('serviceWorker' in navigator)) {
		// Service workers are not supported
		return;
	}

	try {
		// Register the service worker
		const registration = await navigator.serviceWorker.register('/sw.js', {
			scope: '/',
		});

		// Service worker registered successfully

		// Only check for updates on page load if it's been more than 5 minutes since last check
		const lastUpdateCheck = sessionStorage.getItem('sw-last-update-check');
		const now = Date.now();
		if (!lastUpdateCheck || now - parseInt(lastUpdateCheck) > 5 * 60 * 1000) {
			registration.update();
			sessionStorage.setItem('sw-last-update-check', now.toString());
		}

		// Check for updates periodically (every 4 hours instead of every hour)
		setInterval(
			() => {
				registration.update();
				sessionStorage.setItem('sw-last-update-check', Date.now().toString());
			},
			4 * 60 * 60 * 1000
		);

		// Listen for waiting service worker
		registration.addEventListener('updatefound', () => {
			const newWorker = registration.installing;

			if (!newWorker) return;

			// New service worker found, installing...

			newWorker.addEventListener('statechange', () => {
				if (
					newWorker.state === 'installed' &&
					navigator.serviceWorker.controller
				) {
					// New service worker installed, waiting to activate
					// The PWAUpdatePrompt component will handle showing the update UI
				}
			});
		});

		return registration;
	} catch (error) {
		console.error('Service worker registration failed:', error);
	}
};

export const unregisterServiceWorker = async () => {
	if (!('serviceWorker' in navigator)) {
		return;
	}

	try {
		const registration = await navigator.serviceWorker.ready;
		await registration.unregister();
		// Service worker unregistered
	} catch (error) {
		console.error('Service worker unregistration failed:', error);
	}
};

// Check if app is running in standalone mode (PWA)
export const isRunningStandalone = (): boolean => {
	return (
		window.matchMedia('(display-mode: standalone)').matches ||
		(window.navigator as NavigatorStandalone).standalone === true ||
		document.referrer.includes('android-app://')
	);
};

// Request persistent storage (for offline data)
export const requestPersistentStorage = async (): Promise<boolean> => {
	if (navigator.storage && navigator.storage.persist) {
		const isPersisted = await navigator.storage.persist();
		// Persistent storage requested
		return isPersisted;
	}
	return false;
};

// Check storage quota
export const checkStorageQuota = async () => {
	if (navigator.storage && navigator.storage.estimate) {
		const estimate = await navigator.storage.estimate();
		// Storage quota checked
		// Usage: (estimate.usage || 0) / 1024 / 1024 MB
		// Quota: (estimate.quota || 0) / 1024 / 1024 MB

		return estimate;
	}
	return null;
};
