import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(
	amount: number,
	currency: string = 'USD'
): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
	}).format(amount);
}

export function formatCurrencySymbol(
	amount: number,
	currency: string = 'USD'
): string {
	// Currency symbol map for currencies that don't have proper symbols in Intl
	const currencySymbols: Record<string, string> = {
		USD: '$',
		EUR: '€',
		GBP: '£',
		JPY: '¥',
		CNY: '¥',
		INR: '₹',
		BDT: '৳',
		AUD: 'A$',
		CAD: 'C$',
		CHF: 'CHF',
		SEK: 'kr',
		NZD: 'NZ$',
		SGD: 'S$',
		HKD: 'HK$',
		KRW: '₩',
		MXN: 'MX$',
		BRL: 'R$',
		ZAR: 'R',
		RUB: '₽',
		THB: '฿',
		TRY: '₺',
		PLN: 'zł',
		AED: 'د.إ',
		SAR: 'ر.س',
	};

	// Get symbol from map, or try Intl, or fallback to currency code
	let symbol = currencySymbols[currency.toUpperCase()];

	if (!symbol) {
		const parts = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
		}).formatToParts(amount);
		symbol = parts.find(part => part.type === 'currency')?.value || currency;
	}

	const value = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);

	return `${symbol}${value}`;
}

export function formatDate(date: string | Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(new Date(date));
}
