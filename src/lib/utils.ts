import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
