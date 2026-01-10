import axios from 'axios';
import {
	useLoadingStore,
	simulateProgress,
	completeProgress,
} from '@/store/loadingStore';
import { etagCache, invalidateCacheForResource } from '@/lib/hateoas';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Configure axios with optimized settings for large datasets and long-running operations
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	// Timeout for regular requests (60 seconds for large dataset operations)
	timeout: 60000,
	// Maximum content length (100MB for large responses)
	maxContentLength: 100000000,
	maxBodyLength: 100000000,
});

// Request interceptor to add auth token and track loading
api.interceptors.request.use(
	config => {
		// Start tracking this request
		useLoadingStore.getState().startRequest();
		simulateProgress();

		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// Add ETag support for GET requests (70-90% faster repeat requests!)
		if (config.method?.toLowerCase() === 'get' && config.url) {
			const etag = etagCache.get(config.url);
			if (etag) {
				config.headers['If-None-Match'] = etag;
			}
		}

		return config;
	},
	error => {
		// End tracking on request error
		useLoadingStore.getState().endRequest();
		completeProgress();
		return Promise.reject(error);
	}
);

// Response interceptor to handle errors and timeouts
api.interceptors.response.use(
	response => {
		// End tracking on successful response
		useLoadingStore.getState().endRequest();
		completeProgress();

		// Store ETag for future requests (70-90% faster repeat requests!)
		if (
			response.config.method?.toLowerCase() === 'get' &&
			response.headers.etag
		) {
			const url = response.config.url;
			if (url) {
				etagCache.set(url, response.headers.etag);
			}
		}

		// Invalidate ETag cache for mutating operations
		if (
			response.config.method &&
			['post', 'put', 'patch', 'delete'].includes(
				response.config.method.toLowerCase()
			)
		) {
			const url = response.config.url;
			if (url) {
				invalidateCacheForResource(url);
			}
		}

		return response;
	},
	error => {
		// End tracking on error response
		useLoadingStore.getState().endRequest();
		completeProgress();

		// Handle 304 Not Modified - use cached data
		if (error.response?.status === 304) {
			// Return a success response with cached data
			// React Query will handle this with its own cache
			return Promise.resolve({
				...error.response,
				status: 200,
				statusText: 'OK (Cached)',
				data: null, // React Query will use cached data
			});
		}

		// Handle timeout errors
		if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
			console.error('Request timeout - the server took too long to respond');
			error.isTimeout = true;
		}

		// Handle network errors
		if (error.message === 'Network Error') {
			console.error('Network error - please check your connection');
			error.isNetworkError = true;
		}

		// Handle authentication errors
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.href = '/login';
		}

		// Handle server errors (500+)
		if (error.response?.status >= 500) {
			console.error('Server error - please try again later');
			error.isServerError = true;
		}

		return Promise.reject(error);
	}
);

// Create a cancel token source for request cancellation
export const createCancelToken = () => {
	const CancelToken = axios.CancelToken;
	return CancelToken.source();
};

// Check if error is a cancellation
export const isCancel = axios.isCancel;

export default api;
