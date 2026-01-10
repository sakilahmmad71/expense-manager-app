import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for debouncing values
 * Delays updating the value until after the specified delay
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 *
 * @example
 * const [searchQuery, setSearchQuery] = useState('');
 * const debouncedSearch = useDebounce(searchQuery, 300);
 *
 * useEffect(() => {
 *   // API call only happens 300ms after user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

/**
 * Custom hook for debouncing callbacks
 * Returns a memoized debounced function
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced callback
 *
 * @example
 * const handleSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query);
 * }, 300);
 *
 * <Input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number = 500
): (...args: Parameters<T>) => void {
	const timeoutRef = useRef<NodeJS.Timeout>();

	const debouncedCallback = useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay]
	);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedCallback;
}

/**
 * Custom hook for throttling callbacks
 * Ensures function is called at most once per specified interval
 *
 * @param callback - The function to throttle
 * @param delay - Minimum interval in milliseconds (default: 500ms)
 * @returns Throttled callback
 *
 * @example
 * const handleScroll = useThrottle(() => {
 *   console.log('Scroll position:', window.scrollY);
 * }, 200);
 *
 * window.addEventListener('scroll', handleScroll);
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number = 500
): (...args: Parameters<T>) => void {
	const lastRun = useRef<number>(Date.now());
	const timeoutRef = useRef<NodeJS.Timeout>();

	const throttledCallback = useCallback(
		(...args: Parameters<T>) => {
			const now = Date.now();
			const timeSinceLastRun = now - lastRun.current;

			if (timeSinceLastRun >= delay) {
				callback(...args);
				lastRun.current = now;
			} else {
				// Schedule for the end of the throttle period
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}

				timeoutRef.current = setTimeout(() => {
					callback(...args);
					lastRun.current = Date.now();
				}, delay - timeSinceLastRun);
			}
		},
		[callback, delay]
	);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return throttledCallback;
}
