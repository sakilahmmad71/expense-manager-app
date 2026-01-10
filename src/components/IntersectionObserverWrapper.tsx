import { useEffect, useRef, ReactNode } from 'react';

interface IntersectionObserverWrapperProps {
	children: ReactNode;
	onIntersect: () => void;
	threshold?: number;
	rootMargin?: string;
	enabled?: boolean;
}

export const IntersectionObserverWrapper = ({
	children,
	onIntersect,
	threshold = 0.1,
	rootMargin = '50px',
	enabled = true,
}: IntersectionObserverWrapperProps) => {
	const targetRef = useRef<HTMLDivElement>(null);
	const hasIntersected = useRef(false);

	useEffect(() => {
		if (!enabled || hasIntersected.current) return;

		const target = targetRef.current;
		if (!target) return;

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting && !hasIntersected.current) {
						hasIntersected.current = true;
						onIntersect();
					}
				});
			},
			{
				threshold,
				rootMargin,
			}
		);

		observer.observe(target);

		return () => {
			observer.disconnect();
		};
	}, [onIntersect, threshold, rootMargin, enabled]);

	return <div ref={targetRef}>{children}</div>;
};
