/**
 * Format large numbers with compact notation (K, M, B)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "1.2K", "3.4M", "10.5B")
 */
export function formatCompactNumber(
	value: number,
	decimals: number = 1
): string {
	if (value === 0) return '0';

	const absValue = Math.abs(value);
	const sign = value < 0 ? '-' : '';

	if (absValue >= 1_000_000_000) {
		return `${sign}${(absValue / 1_000_000_000).toFixed(decimals)}B`;
	}
	if (absValue >= 1_000_000) {
		return `${sign}${(absValue / 1_000_000).toFixed(decimals)}M`;
	}
	if (absValue >= 1_000) {
		return `${sign}${(absValue / 1_000).toFixed(decimals)}K`;
	}

	return value.toString();
}

/**
 * Format currency with compact notation for large amounts
 * @param value - The number to format
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @param locale - Locale for formatting (default: 'en-US')
 * @param threshold - Threshold above which to use compact notation (default: 1,000,000)
 * @returns Formatted currency string
 */
export function formatCompactCurrency(
	value: number,
	currency: string = 'USD',
	locale: string = 'en-US',
	threshold: number = 1_000_000
): string {
	const absValue = Math.abs(value);

	// Use compact notation for large amounts
	if (absValue >= threshold) {
		const sign = value < 0 ? '-' : '';
		const currencySymbol = new Intl.NumberFormat(locale, {
			style: 'currency',
			currency,
		})
			.format(0)
			.replace(/[\d.,\s]/g, '');

		if (absValue >= 1_000_000_000) {
			return `${sign}${currencySymbol}${(absValue / 1_000_000_000).toFixed(1)}B`;
		}
		if (absValue >= 1_000_000) {
			return `${sign}${currencySymbol}${(absValue / 1_000_000).toFixed(1)}M`;
		}
		if (absValue >= 1_000) {
			return `${sign}${currencySymbol}${(absValue / 1_000).toFixed(1)}K`;
		}
	}

	// Use standard formatting for smaller amounts
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
}

/**
 * Format number with abbreviation and full tooltip value
 * Returns both compact and full formatted values
 */
export function formatNumberWithTooltip(
	value: number,
	options?: {
		currency?: string;
		locale?: string;
		threshold?: number;
	}
) {
	const { currency, locale = 'en-US', threshold = 1_000_000 } = options || {};

	const compact = currency
		? formatCompactCurrency(value, currency, locale, threshold)
		: formatCompactNumber(value);

	const full = currency
		? new Intl.NumberFormat(locale, {
				style: 'currency',
				currency,
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			}).format(value)
		: new Intl.NumberFormat(locale).format(value);

	return { compact, full };
}
