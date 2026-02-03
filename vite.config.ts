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
				// Improved chunk splitting strategy for better code splitting
				manualChunks(id) {
					// Vendor chunks
					if (id.includes('node_modules')) {
						// React core
						if (
							id.includes('react') ||
							id.includes('react-dom') ||
							id.includes('react-router')
						) {
							return 'vendor-react';
						}

						// React Query
						if (id.includes('@tanstack/react-query')) {
							return 'vendor-query';
						}

						// ECharts - split into separate chunk for lazy loading
						if (id.includes('echarts') || id.includes('zrender')) {
							return 'charts';
						}

						// Radix UI and Lucide icons
						if (id.includes('@radix-ui') || id.includes('lucide-react')) {
							return 'ui';
						}

						// Date libraries
						if (id.includes('date-fns')) {
							return 'vendor-dates';
						}

						// Other dependencies
						return 'libs';
					}

					// Split dashboard chart components into individual chunks
					if (id.includes('/components/dashboard/')) {
						if (id.includes('MonthlyTrendsChart')) return 'chart-monthly';
						if (id.includes('ExpenseTrendChart')) return 'chart-trend';
						if (id.includes('CategoryBreakdownChart')) return 'chart-breakdown';
						if (id.includes('TopCategoriesChart')) return 'chart-top';
					}

					// Split pages into individual chunks (already lazy loaded)
					if (id.includes('/pages/')) {
						const pageName = id.match(/pages\/(.+?)\.tsx?/)?.[1];
						if (pageName) return `page-${pageName.toLowerCase()}`;
					}
				},

				// Optimize chunk naming for caching
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',

				// Optimize asset naming
				assetFileNames: assetInfo => {
					const info = assetInfo.name?.split('.');
					const ext = info?.[info.length - 1];
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
						return `assets/images/[name]-[hash][extname]`;
					} else if (/woff2?|ttf|otf|eot/i.test(ext || '')) {
						return `assets/fonts/[name]-[hash][extname]`;
					}
					return `assets/[name]-[hash][extname]`;
				},
			},
		},

		// Chunk size warning threshold
		chunkSizeWarningLimit: 500,

		// Enable source maps for better debugging in development
		sourcemap: mode === 'development',

		// Minification options (esbuild is faster and uses less memory than terser)
		minify: 'esbuild',

		// Drop console statements in production with esbuild
		...(mode === 'production' && {
			esbuild: {
				drop: ['console', 'debugger'],
			},
		}),

		// CSS code splitting
		cssCodeSplit: true,

		// Target modern browsers for smaller bundles
		target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],

		// Enable compression
		reportCompressedSize: true,
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
