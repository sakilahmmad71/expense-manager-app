import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { registerServiceWorker } from '@/lib/pwa';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

// Web Vitals monitoring
function sendToAnalytics(metric: Metric) {
	// Send to Google Analytics if available
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (typeof window !== 'undefined' && (window as any).gtag) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).gtag('event', metric.name, {
			value: Math.round(metric.value),
			event_category: 'Web Vitals',
			event_label: metric.id,
			non_interaction: true,
		});
	}
}

// Track Web Vitals in production
if (import.meta.env.VITE_APP_ENV === 'production') {
	onCLS(sendToAnalytics);
	onINP(sendToAnalytics); // Replaced FID with INP in web-vitals v4+
	onFCP(sendToAnalytics);
	onLCP(sendToAnalytics);
	onTTFB(sendToAnalytics);
}

// Register service worker for PWA functionality
if (import.meta.env.VITE_APP_ENV === 'production') {
	registerServiceWorker();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
