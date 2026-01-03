import axios from 'axios';
import {
	useLoadingStore,
	simulateProgress,
	completeProgress,
} from '@/store/loadingStore';

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
		return response;
	},
	error => {
		// End tracking on error response
		useLoadingStore.getState().endRequest();
		completeProgress();

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
