// Service Worker for Expenser PWA
// Version 2.1.0 - Updated icon configuration and optimized caching

const CACHE_VERSION = 'v2.1';
const CACHE_NAME = `expenser-${CACHE_VERSION}`;
const RUNTIME_CACHE = `expenser-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `expenser-images-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
	'/',
	'/index.html',
	'/offline.html',
	'/favicon.svg',
	'/favicon-32x32.png',
	'/favicon-16x16.png',
	'/icon-192.png',
	'/icon-512.png',
	'/manifest.json',
];

// Install event - cache essential assets
self.addEventListener('install', event => {
	console.log('[SW] Installing service worker...');
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(cache => {
				console.log('[SW] Precaching app shell');
				return cache.addAll(PRECACHE_ASSETS);
			})
		// Don't auto-skip waiting - let the user decide via the update prompt
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
	console.log('[SW] Activating service worker...');
	event.waitUntil(
		caches
			.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames
						.filter(cacheName => {
							// Delete old caches
							return (
								cacheName.startsWith('expenser-') && cacheName !== CACHE_NAME &&
								cacheName !== RUNTIME_CACHE && cacheName !== IMAGE_CACHE
							);
						})
						.map(cacheName => {
							console.log('[SW] Deleting old cache:', cacheName);
							return caches.delete(cacheName);
						})
				);
			})
			.then(() => self.clients.claim())
	);
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip cross-origin requests (including external API)
	if (url.origin !== location.origin) {
		return;
	}

	// Skip API requests (handled by external server)
	if (url.pathname.startsWith('/api/')) {
		return;
	}

	// Images - Cache First with network fallback
	if (request.destination === 'image') {
		event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
		return;
	}

	// App shell and assets - Cache First with network fallback
	if (
		request.destination === 'script' ||
		request.destination === 'style' ||
		request.destination === 'font' ||
		request.mode === 'navigate'
	) {
		event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
		return;
	}

	// Default - Network First
	event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
});

// Network First Strategy - Try network, fallback to cache
async function networkFirstStrategy(request, cacheName) {
	try {
		const networkResponse = await fetch(request);

		// Cache successful responses
		if (networkResponse.ok) {
			const cache = await caches.open(cacheName);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		console.log('[SW] Network request failed, trying cache:', request.url);
		const cachedResponse = await caches.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		// For navigation requests, return offline page or index
		if (request.mode === 'navigate') {
			const cache = await caches.open(CACHE_NAME);
			const offlinePage = await cache.match('/offline.html');
			if (offlinePage) return offlinePage;
			const indexPage = await cache.match('/index.html');
			return indexPage || Response.error();
		}

		return Response.error();
	}
}

// Cache First Strategy - Try cache, fallback to network
async function cacheFirstStrategy(request, cacheName) {
	const cachedResponse = await caches.match(request);

	if (cachedResponse) {
		// Update cache in background
		fetch(request)
			.then(networkResponse => {
				if (networkResponse.ok) {
					caches.open(cacheName).then(cache => {
						cache.put(request, networkResponse);
					});
				}
			})
			.catch(() => {
				// Ignore background fetch errors
			});

		return cachedResponse;
	}

	try {
		const networkResponse = await fetch(request);

		if (networkResponse.ok) {
			const cache = await caches.open(cacheName);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		console.error('[SW] Fetch failed:', error);
		return Response.error();
	}
}

// Background sync for offline actions
self.addEventListener('sync', event => {
	console.log('[SW] Background sync:', event.tag);

	if (event.tag === 'sync-expenses') {
		event.waitUntil(syncExpenses());
	}
});

async function syncExpenses() {
	// Implement offline expense sync logic
	console.log('[SW] Syncing offline expenses...');
	// This would sync any offline-created expenses when back online
}

// Push notifications support (for future use)
self.addEventListener('push', event => {
	const data = event.data ? event.data.json() : {};
	const title = data.title || 'Expenser';
	const options = {
		body: data.body || 'New notification',
		icon: '/icon-192.png',
		badge: '/icon-192.png',
		...data.options,
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', event => {
	event.notification.close();

	event.waitUntil(
		clients.openWindow(event.notification.data?.url || '/')
	);
});

// Message event handler for update notifications
self.addEventListener('message', event => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
