import { useEffect } from 'react';
import { Progress } from './ui/progress';
import { useLoadingStore } from '@/store/loadingStore';

export const GlobalLoadingBar = () => {
	const { isLoading, progress } = useLoadingStore();

	// Reset progress when not loading
	useEffect(() => {
		if (!isLoading && progress === 100) {
			const timer = setTimeout(() => {
				useLoadingStore.getState().reset();
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [isLoading, progress]);

	if (!isLoading && progress === 0) {
		return null;
	}

	return (
		<div className="fixed top-0 left-0 right-0 z-[100]">
			<Progress value={progress} className="h-1 rounded-none bg-transparent" />
		</div>
	);
};
