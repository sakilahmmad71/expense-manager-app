/**
 * Performance Monitoring Utilities
 *
 * Tools for measuring and tracking application performance
 * Use in development to identify bottlenecks
 */

/**
 * Measure time taken by a function
 *
 * @example
 * const result = measurePerformance('expensive-calculation', () => {
 *   return heavyComputation();
 * });
 */
export function measurePerformance<T>(label: string, fn: () => T): T {
	const start = performance.now();
	const result = fn();
	const end = performance.now();

	console.warn(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);

	return result;
}

/**
 * Measure async function performance
 *
 * @example
 * const data = await measureAsyncPerformance('fetch-data', async () => {
 *   return await fetchData();
 * });
 */
export async function measureAsyncPerformance<T>(
	label: string,
	fn: () => Promise<T>
): Promise<T> {
	const start = performance.now();
	const result = await fn();
	const end = performance.now();

	console.warn(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);

	return result;
}

/**
 * Report Web Vitals metrics
 * Measures Core Web Vitals: LCP, INP, CLS
 * Note: Requires 'web-vitals' package to be installed
 * Run: pnpm add web-vitals
 */
export function reportWebVitals(onPerfEntry?: (metric: unknown) => void) {
	if (onPerfEntry && onPerfEntry instanceof Function) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore - web-vitals is optional
		import('web-vitals')
			.then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
				onCLS(onPerfEntry);
				onINP(onPerfEntry); // Replaced FID with INP in web-vitals v4+
				onFCP(onPerfEntry);
				onLCP(onPerfEntry);
				onTTFB(onPerfEntry);
			})
			.catch(() => {
				console.warn('web-vitals not installed. Run: pnpm add web-vitals');
			});
	}
}

/**
 * Performance marks for custom measurements
 *
 * @example
 * markStart('data-processing');
 * // ... do work ...
 * markEnd('data-processing');
 * getMeasure('data-processing'); // Returns duration in ms
 */
export function markStart(name: string) {
	performance.mark(`${name}-start`);
}

export function markEnd(name: string) {
	performance.mark(`${name}-end`);
	performance.measure(name, `${name}-start`, `${name}-end`);
}

export function getMeasure(name: string): number | null {
	const entries = performance.getEntriesByName(name, 'measure');
	if (entries.length > 0) {
		return entries[entries.length - 1].duration;
	}
	return null;
}

/**
 * Clear all performance marks and measures
 */
export function clearMarks() {
	performance.clearMarks();
	performance.clearMeasures();
}

/**
 * Track component render count (for development)
 *
 * @example
 * function MyComponent() {
 *   useRenderCount('MyComponent');
 *   return <div>...</div>;
 * }
 */
export function useRenderCount(componentName: string) {
	const renderCount = React.useRef(0);

	React.useEffect(() => {
		renderCount.current += 1;
		console.warn(`🔄 ${componentName} rendered ${renderCount.current} times`);
	});
}

/**
 * Detect slow renders (>16ms for 60fps)
 *
 * @example
 * function MyComponent() {
 *   useSlowRenderDetection('MyComponent', 16);
 *   return <div>...</div>;
 * }
 */
export function useSlowRenderDetection(
	componentName: string,
	threshold: number = 16
) {
	React.useEffect(() => {
		const startTime = performance.now();

		return () => {
			const renderTime = performance.now() - startTime;
			if (renderTime > threshold) {
				console.warn(
					`⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
				);
			}
		};
	});
}

/**
 * Bundle size analyzer
 * Reports imported module sizes in development
 */
export function reportBundleSize() {
	if (import.meta.env.MODE === 'development') {
		// Get all loaded modules
		const scripts = Array.from(document.scripts);
		const totalSize = scripts.reduce((acc, script) => {
			if (script.src) {
				return acc + (script.src.length || 0);
			}
			return acc;
		}, 0);

		console.warn(
			`📦 Estimated bundle size: ${(totalSize / 1024).toFixed(2)}KB`
		);
	}
}

/**
 * Memory usage monitoring
 * Only works in browsers that support performance.memory
 */
export function logMemoryUsage() {
	if ('memory' in performance) {
		const memory = (
			performance as {
				memory: {
					usedJSHeapSize: number;
					totalJSHeapSize: number;
					jsHeapSizeLimit: number;
				};
			}
		).memory;
		console.warn(`💾 Memory Usage:
  Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB
  Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB
  Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`);
	} else {
		console.warn('Memory API not supported in this browser');
	}
}

/**
 * Performance observer for tracking long tasks
 * Helps identify blocking operations
 */
export function observeLongTasks(callback?: (entry: PerformanceEntry) => void) {
	if ('PerformanceObserver' in window) {
		try {
			const observer = new PerformanceObserver(list => {
				for (const entry of list.getEntries()) {
					console.warn(
						`⚠️ Long task detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`
					);
					callback?.(entry);
				}
			});

			observer.observe({ entryTypes: ['longtask'] });

			return () => observer.disconnect();
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			console.warn('Long task observation not supported');
		}
	}

	return () => {};
}

/**
 * Network timing information
 * Shows how long resources took to load
 */
export function logNetworkTiming() {
	const resources = performance.getEntriesByType('navigation');

	if (resources.length > 0) {
		const nav = resources[0] as PerformanceNavigationTiming;

		console.warn(`🌐 Network Timing:
  DNS: ${(nav.domainLookupEnd - nav.domainLookupStart).toFixed(2)}ms
  TCP: ${(nav.connectEnd - nav.connectStart).toFixed(2)}ms
  Request: ${(nav.responseStart - nav.requestStart).toFixed(2)}ms
  Response: ${(nav.responseEnd - nav.responseStart).toFixed(2)}ms
  DOM Processing: ${(nav.domComplete - nav.domContentLoadedEventStart).toFixed(2)}ms
  Total: ${(nav.loadEventEnd - nav.fetchStart).toFixed(2)}ms`);
	}
}

/**
 * Track React Query cache statistics
 */
export function logQueryCacheStats(queryClient: {
	getQueryCache: () => {
		getAll: () => Array<{
			state: { dataUpdateCount: number; isFetching: boolean; status: string };
			isStale: () => boolean;
		}>;
	};
}) {
	const cache = queryClient.getQueryCache();
	const queries = cache.getAll();

	const stats = {
		total: queries.length,
		fresh: queries.filter(q => q.state.dataUpdateCount > 0 && !q.isStale())
			.length,
		stale: queries.filter(q => q.isStale()).length,
		fetching: queries.filter(q => q.state.isFetching).length,
		error: queries.filter(q => q.state.status === 'error').length,
	};

	console.warn(`🗄️ Query Cache Stats:`, stats);

	return stats;
}

// React import for hooks
import * as React from 'react';
