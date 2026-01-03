import { create } from 'zustand';

interface LoadingState {
	activeRequests: number;
	progress: number;
	isLoading: boolean;
	startRequest: () => void;
	endRequest: () => void;
	reset: () => void;
}

export const useLoadingStore = create<LoadingState>(set => ({
	activeRequests: 0,
	progress: 0,
	isLoading: false,
	startRequest: () =>
		set(state => {
			const newActiveRequests = state.activeRequests + 1;
			// Start at 10% when request begins, simulate progress
			const newProgress = state.activeRequests === 0 ? 10 : state.progress;
			return {
				activeRequests: newActiveRequests,
				isLoading: true,
				progress: newProgress,
			};
		}),
	endRequest: () =>
		set(state => {
			const newActiveRequests = Math.max(0, state.activeRequests - 1);
			return {
				activeRequests: newActiveRequests,
				isLoading: newActiveRequests > 0,
				progress: newActiveRequests === 0 ? 100 : state.progress,
			};
		}),
	reset: () =>
		set({
			activeRequests: 0,
			progress: 0,
			isLoading: false,
		}),
}));

// Progress simulation for better UX
let progressInterval: NodeJS.Timeout | null = null;

export const simulateProgress = () => {
	if (progressInterval) {
		clearInterval(progressInterval);
	}

	progressInterval = setInterval(() => {
		const state = useLoadingStore.getState();
		if (state.isLoading && state.progress < 90) {
			// Gradually increase progress but never reach 100% until request completes
			const increment = Math.random() * 10;
			const newProgress = Math.min(90, state.progress + increment);
			useLoadingStore.setState({ progress: newProgress });
		}
	}, 500);
};

export const completeProgress = () => {
	if (progressInterval) {
		clearInterval(progressInterval);
		progressInterval = null;
	}

	useLoadingStore.setState({ progress: 100 });

	// Reset after animation completes
	setTimeout(() => {
		const state = useLoadingStore.getState();
		if (!state.isLoading) {
			useLoadingStore.getState().reset();
		}
	}, 500);
};
