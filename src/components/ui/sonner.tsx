import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';
import { useEffect, useState } from 'react';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
		};

		// Check initially
		checkMobile();

		// Add event listener for window resize
		window.addEventListener('resize', checkMobile);

		// Cleanup
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className="toaster group"
			position={isMobile ? 'top-center' : 'bottom-center'}
			toastOptions={{
				classNames: {
					toast:
						'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
					description:
						'group-[.toast]:text-foreground group-[.toast]:opacity-90',
					actionButton:
						'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
					cancelButton:
						'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
