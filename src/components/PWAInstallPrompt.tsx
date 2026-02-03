import { useEffect, useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NavigatorStandalone extends Navigator {
	standalone?: boolean;
}

export const PWAInstallPrompt = () => {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		// Check if already installed as PWA
		const isInStandaloneMode =
			window.matchMedia('(display-mode: standalone)').matches ||
			(window.navigator as NavigatorStandalone).standalone === true;

		setIsStandalone(isInStandaloneMode);

		// Detect iOS
		const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
		setIsIOS(iOS);

		// Check if user has dismissed the prompt before
		const hasDismissed = localStorage.getItem('pwa-install-dismissed');
		const dismissedTime = hasDismissed ? parseInt(hasDismissed) : 0;
		const daysSinceDismissed =
			(Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

		// Show prompt if not dismissed or if 7 days have passed
		if (isInStandaloneMode) {
			// Already installed, don't show
			return;
		}

		if (iOS && (!hasDismissed || daysSinceDismissed > 7)) {
			// Show iOS install instructions after a delay
			setTimeout(() => setShowPrompt(true), 3000);
		}

		// Listen for the beforeinstallprompt event (for Chrome, Edge, etc.)
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);

			// Show prompt if not dismissed or if 7 days have passed
			if (!hasDismissed || daysSinceDismissed > 7) {
				setTimeout(() => setShowPrompt(true), 3000);
			}
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt
			);
		};
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		// Show the install prompt
		await deferredPrompt.prompt();

		// Wait for the user to respond
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			// User accepted - install will proceed automatically
		}

		// Clear the deferredPrompt
		setDeferredPrompt(null);
		setShowPrompt(false);
	};

	const handleDismiss = () => {
		setShowPrompt(false);
		localStorage.setItem('pwa-install-dismissed', Date.now().toString());
	};

	// Don't show if already installed
	if (isStandalone || !showPrompt) {
		return null;
	}

	return (
		<div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
			<div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-5">
				{/* Close button */}
				<button
					onClick={handleDismiss}
					className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
					aria-label="Dismiss"
				>
					<X className="h-4 w-4" />
				</button>

				{/* Icon */}
				<div className="flex items-start gap-3 md:gap-4 mb-3">
					<div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
						<img
							src="/favicon.svg"
							alt="Expenser"
							className="w-7 h-7 md:w-8 md:h-8"
						/>
					</div>
					<div className="flex-1 min-w-0 pr-6">
						<h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">
							Install Expenser
						</h3>
						<p className="text-xs md:text-sm text-gray-600 leading-relaxed">
							Get quick access and work offline. Install our app for the best
							experience!
						</p>
					</div>
				</div>

				{/* Installation Instructions */}
				{isIOS ? (
					<div className="bg-blue-50 rounded-xl p-3 mb-3">
						<div className="flex items-start gap-2">
							<Share2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
							<div className="text-xs md:text-sm text-blue-900">
								<p className="font-semibold mb-1">To install on iOS:</p>
								<ol className="space-y-1 ml-1">
									<li>1. Tap the Share button below</li>
									<li>2. Select "Add to Home Screen"</li>
									<li>3. Tap "Add" to confirm</li>
								</ol>
							</div>
						</div>
					</div>
				) : (
					<div className="flex gap-2">
						<Button
							onClick={handleInstallClick}
							className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 h-10 md:h-11 text-xs md:text-sm font-semibold"
						>
							<Download className="h-4 w-4 mr-2" />
							Install App
						</Button>
						<Button
							onClick={handleDismiss}
							variant="outline"
							className="rounded-xl border-gray-300 hover:bg-gray-50 h-10 md:h-11 px-3 md:px-4 text-xs md:text-sm"
						>
							Not Now
						</Button>
					</div>
				)}

				{isIOS && (
					<Button
						onClick={handleDismiss}
						variant="ghost"
						className="w-full mt-2 text-xs md:text-sm text-gray-600 hover:text-gray-900"
					>
						Maybe Later
					</Button>
				)}
			</div>
		</div>
	);
};
