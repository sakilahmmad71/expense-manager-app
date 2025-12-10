import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [
		react({
			// Enable automatic JSX runtime for better performance
			jsxRuntime: 'automatic',
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@context': path.resolve(__dirname, './src/context'),
			'@lib': path.resolve(__dirname, './src/lib'),
			'@pages': path.resolve(__dirname, './src/pages'),
		},
	},
	build: {
		// Optimize for production builds
		rollupOptions: {
			output: {
				// Manual chunk splitting for optimal loading
				manualChunks: {
					// Core React libraries
					'react-vendor': ['react', 'react-dom'],

					// Router and navigation
					router: ['react-router-dom'],

					// UI Framework (Radix UI + shadcn/ui components)
					'ui-vendor': [
						'@radix-ui/react-dialog',
						'@radix-ui/react-dropdown-menu',
						'@radix-ui/react-select',
						'@radix-ui/react-toast',
						'@radix-ui/react-slot',
						'@radix-ui/react-label',
					],

					// Icons
					icons: ['lucide-react'],

					// Charts and data visualization
					charts: ['recharts'],

					// Form handling
					forms: ['react-hook-form'],

					// HTTP client
					api: ['axios'],

					// Utility libraries
					utils: ['clsx', 'tailwind-merge', 'date-fns', 'class-variance-authority'],
				},

				// Optimize chunk naming for caching
				chunkFileNames: 'assets/[name]-[hash].js',

				// Optimize asset naming
				assetFileNames: 'assets/[name]-[hash].[ext]',
			},
		},

		// Chunk size warning threshold
		chunkSizeWarningLimit: 600,

		// Enable source maps for better debugging in development
		sourcemap: mode === 'development',

		// Minification options
		minify: 'terser',
		terserOptions: {
			compress: {
				// Remove console.logs in production
				drop_console: mode === 'production',
				drop_debugger: mode === 'production',
				// Remove pure function annotations
				pure_funcs:
					mode === 'production'
						? ['console.log', 'console.info', 'console.debug', 'console.trace']
						: [],
			},
			format: {
				// Remove comments in production
				comments: false,
			},
		},

		// CSS code splitting
		cssCodeSplit: true,

		// Target modern browsers for smaller bundles
		target: 'esnext',
	},

	// Development optimizations
	optimizeDeps: {
		include: [
			'react',
			'react-dom',
			'react-router-dom',
			'@radix-ui/react-dialog',
			'@radix-ui/react-dropdown-menu',
			'@radix-ui/react-select',
			'lucide-react',
		],
	},

	// Server configuration for development
	server: {
		port: 5173,
		host: true,
		hmr: {
			overlay: true, // Show error overlay for development
		},
	},
}));
