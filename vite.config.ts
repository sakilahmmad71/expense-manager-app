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
				// Simplified chunk splitting for low-memory builds
				manualChunks: {
					// Combine all vendors into fewer chunks to reduce memory overhead
					vendor: ['react', 'react-dom', 'react-router-dom'],
					ui: [
						'@radix-ui/react-dialog',
						'@radix-ui/react-dropdown-menu',
						'@radix-ui/react-select',
						'@radix-ui/react-toast',
						'@radix-ui/react-slot',
						'@radix-ui/react-label',
						'lucide-react',
					],
					charts: ['echarts', 'echarts-for-react'],
				},

				// Optimize chunk naming for caching
				chunkFileNames: 'assets/[name]-[hash].js',

				// Optimize asset naming
				assetFileNames: 'assets/[name]-[hash].[ext]',
			},
		},

		// Chunk size warning threshold
		chunkSizeWarningLimit: 1000,

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
