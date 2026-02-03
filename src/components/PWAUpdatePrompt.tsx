import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PWAUpdatePrompt = () => {
	const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
	const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
		null
	);

	useEffect(() => {
		// Check if service workers are supported
		if (!('serviceWorker' in navigator)) {
			return;
		}

		// Listen for service worker updates
		navigator.serviceWorker.ready.then(registration => {
			registration.addEventListener('updatefound', () => {
				const newWorker = registration.installing;

				if (!newWorker) return;

				newWorker.addEventListener('statechange', () => {
					if (
						newWorker.state === 'installed' &&
						navigator.serviceWorker.controller
					) {
						// New service worker is installed but waiting to activate
						setWaitingWorker(newWorker);
						setShowUpdatePrompt(true);
					}
				});
			});
		});

		// Listen for controlling service worker changes
		let refreshing = false;
		navigator.serviceWorker.addEventListener('controllerchange', () => {
			if (!refreshing) {
				refreshing = true;
				window.location.reload();
			}
		});
	}, []);

	const handleUpdate = () => {
		if (!waitingWorker) return;

		// Send message to service worker to skip waiting
		waitingWorker.postMessage({ type: 'SKIP_WAITING' });
		setShowUpdatePrompt(false);
	};

	const handleDismiss = () => {
		setShowUpdatePrompt(false);
	};

	if (!showUpdatePrompt) {
		return null;
	}

	return (
		<div className="fixed top-20 md:top-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-top-4 fade-in duration-500">
			<div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-4 md:p-5 text-white">
				<div className="flex items-start gap-3 md:gap-4">
					<div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
						<RefreshCw className="h-5 w-5 md:h-6 md:w-6" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-sm md:text-base font-bold mb-1">
							Update Available
						</h3>
						<p className="text-xs md:text-sm text-blue-100 leading-relaxed mb-3">
							A new version of Expenser is ready. Update now to get the latest
							features and improvements!
						</p>
						<div className="flex gap-2">
							<Button
								onClick={handleUpdate}
								className="flex-1 bg-white text-blue-600 hover:bg-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 h-9 md:h-10 text-xs md:text-sm font-semibold"
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								Update Now
							</Button>
							<Button
								onClick={handleDismiss}
								variant="ghost"
								className="rounded-xl text-white hover:bg-white/10 h-9 md:h-10 px-3 md:px-4 text-xs md:text-sm"
							>
								Later
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
