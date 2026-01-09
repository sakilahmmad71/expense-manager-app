/**
 * HATEOAS Link interface matching backend response structure
 */
export interface HateoasLink {
	rel: string;
	href: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	description?: string;
}

/**
 * Base interface for responses that include HATEOAS links
 */
export interface HateoasResponse<T> {
	data?: T;
	_links?: HateoasLink[];
	[key: string]: unknown;
}

/**
 * ETag cache for storing response ETags
 */
class ETagCache {
	private cache = new Map<string, string>();

	set(url: string, etag: string): void {
		this.cache.set(url, etag);
	}

	get(url: string): string | undefined {
		return this.cache.get(url);
	}

	has(url: string): boolean {
		return this.cache.has(url);
	}

	clear(): void {
		this.cache.clear();
	}

	delete(url: string): void {
		this.cache.delete(url);
	}

	/**
	 * Invalidate cache entries matching a pattern
	 */
	invalidatePattern(pattern: string): void {
		const regex = new RegExp(pattern);
		for (const [key] of this.cache) {
			if (regex.test(key)) {
				this.cache.delete(key);
			}
		}
	}
}

export const etagCache = new ETagCache();

/**
 * Find a link by relation type
 */
export const findLink = (
	links: HateoasLink[] | undefined,
	rel: string
): HateoasLink | undefined => {
	if (!links || !Array.isArray(links)) return undefined;
	return links.find(link => link.rel === rel);
};

/**
 * Find all links by relation type
 */
export const findLinks = (
	links: HateoasLink[] | undefined,
	rel: string
): HateoasLink[] => {
	if (!links || !Array.isArray(links)) return [];
	return links.filter(link => link.rel === rel);
};

/**
 * Get href from a link by relation type
 */
export const getLinkHref = (
	links: HateoasLink[] | undefined,
	rel: string
): string | undefined => {
	const link = findLink(links, rel);
	return link?.href;
};

/**
 * Check if a link exists with a specific relation
 */
export const hasLink = (
	links: HateoasLink[] | undefined,
	rel: string
): boolean => {
	return !!findLink(links, rel);
};

/**
 * Extract links by method type
 */
export const getLinksByMethod = (
	links: HateoasLink[] | undefined,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
): HateoasLink[] => {
	if (!links || !Array.isArray(links)) return [];
	return links.filter(link => link.method === method);
};

/**
 * Group links by relation type
 */
export const groupLinksByRel = (
	links: HateoasLink[] | undefined
): Record<string, HateoasLink[]> => {
	if (!links || !Array.isArray(links)) return {};

	return links.reduce(
		(acc, link) => {
			if (!acc[link.rel]) {
				acc[link.rel] = [];
			}
			acc[link.rel].push(link);
			return acc;
		},
		{} as Record<string, HateoasLink[]>
	);
};

/**
 * Get available actions from links (for UI rendering)
 */
export const getAvailableActions = (
	links: HateoasLink[] | undefined
): Array<{ action: string; method: string; description?: string }> => {
	if (!links || !Array.isArray(links)) return [];

	return links.map(link => ({
		action: link.rel,
		method: link.method,
		description: link.description,
	}));
};

/**
 * Build full URL from relative href
 */
export const buildFullUrl = (
	href: string,
	baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:3000'
): string => {
	if (href.startsWith('http')) return href;
	if (href.startsWith('/api/v1'))
		return `${baseUrl.replace('/api/v1', '')}${href}`;
	if (href.startsWith('/')) return `${baseUrl}${href}`;
	return `${baseUrl}/${href}`;
};

/**
 * Extract collection links (pagination, search, filters)
 */
export const getCollectionLinks = (links: HateoasLink[] | undefined) => {
	if (!links) return {};

	return {
		self: findLink(links, 'self'),
		next: findLink(links, 'next'),
		prev: findLink(links, 'prev'),
		first: findLink(links, 'first'),
		last: findLink(links, 'last'),
		create: findLink(links, 'create'),
	};
};

/**
 * Extract resource links (CRUD operations)
 */
export const getResourceLinks = (links: HateoasLink[] | undefined) => {
	if (!links) return {};

	return {
		self: findLink(links, 'self'),
		update: findLink(links, 'update'),
		delete: findLink(links, 'delete'),
		list: findLink(links, 'list'),
	};
};

/**
 * Invalidate ETag cache when data changes
 */
export const invalidateCacheForResource = (resourcePath: string): void => {
	// Invalidate exact match
	etagCache.delete(resourcePath);

	// Invalidate related paths (e.g., /expenses/123 invalidates /expenses)
	const segments = resourcePath.split('/').filter(Boolean);
	if (segments.length > 1) {
		// Invalidate parent collection
		const parentPath = `/${segments.slice(0, -1).join('/')}`;
		etagCache.invalidatePattern(parentPath);
	}

	// Invalidate dashboard if it's an expense or category
	if (
		resourcePath.includes('expenses') ||
		resourcePath.includes('categories')
	) {
		etagCache.invalidatePattern('/dashboard');
	}
};

/**
 * Format link for logging/debugging
 */
export const formatLink = (link: HateoasLink): string => {
	return `[${link.method}] ${link.rel} -> ${link.href}${
		link.description ? ` (${link.description})` : ''
	}`;
};

/**
 * Validate link structure
 */
export const isValidLink = (link: unknown): link is HateoasLink => {
	if (typeof link !== 'object' || link === null) return false;
	const l = link as Record<string, unknown>;
	return (
		typeof l.rel === 'string' &&
		typeof l.href === 'string' &&
		typeof l.method === 'string' &&
		['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(l.method as string)
	);
};
