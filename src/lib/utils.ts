import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { currencies } from '@/constants/currencies';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format currency with proper locale and symbol
 */
export function formatCurrency(
	value: number,
	currency: string = 'USD',
	locale: string = 'en-US'
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
}

/**
 * Get currency symbol for a given currency code
 */
export function formatCurrencySymbol(
	currency: string = 'USD',
	locale: string = 'en-US'
): string {
	// Try to find the currency in our constants first
	const currencyData = currencies.find(c => c.code === currency);
	if (currencyData) {
		return currencyData.symbol;
	}

	// Fallback to Intl.NumberFormat for currencies not in our constants
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	})
		.format(0)
		.replace(/[\d.,\s]/g, '');
}

/**
 * Format date to localized string
 */
export function formatDate(
	date: string | Date,
	locale: string = 'en-US'
): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(dateObj);
}

/**
 * Throttle function - executes immediately on first call, then limits subsequent calls
 * @param func Function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	let lastResult: ReturnType<T>;

	return function (this: unknown, ...args: Parameters<T>) {
		if (!inThrottle) {
			lastResult = func.apply(this, args) as ReturnType<T>;
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
		return lastResult as void;
	};
}
