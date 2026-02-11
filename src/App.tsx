import { Layout } from '@components/Layout';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Toaster } from '@components/ui/sonner';
import { NetworkStatusIndicator } from '@components/NetworkStatusIndicator';
import { PWAInstallPrompt } from '@components/PWAInstallPrompt';
import { PWAUpdatePrompt } from '@components/PWAUpdatePrompt';
import { AuthProvider } from '@context/AuthContext';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@pages/ResetPasswordPage';
import AuthCallback from '@pages/AuthCallback';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load heavy pages for better initial load performance
const DashboardPage = lazy(() =>
	import('@pages/DashboardPage').then(module => ({
		default: module.DashboardPage,
	}))
);
const ExpensesPage = lazy(() =>
	import('@pages/ExpensesPage').then(module => ({
		default: module.ExpensesPage,
	}))
);
const CategoriesPage = lazy(() =>
	import('@pages/CategoriesPage').then(module => ({
		default: module.CategoriesPage,
	}))
);
// const BudgetsPage = lazy(() =>
// 	import('@pages/BudgetsPage').then(module => ({
// 		default: module.BudgetsPage,
// 	}))
// );
const ProfilePage = lazy(() =>
	import('@pages/ProfilePage').then(module => ({ default: module.ProfilePage }))
);
const PrivacyPage = lazy(() =>
	import('@pages/PrivacyPage').then(module => ({ default: module.PrivacyPage }))
);
const TermsPage = lazy(() =>
	import('@pages/TermsPage').then(module => ({ default: module.TermsPage }))
);
const SecurityPage = lazy(() =>
	import('@pages/SecurityPage').then(module => ({
		default: module.SecurityPage,
	}))
);

// Loading fallback component
const PageLoader = () => (
	<div className="min-h-screen flex items-center justify-center">
		<div className="text-center space-y-4">
			<Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
			<p className="text-gray-600 animate-pulse">Loading...</p>
		</div>
	</div>
);

// Configure QueryClient with real-time data validation for financial accuracy
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Cache Configuration - optimized for real-time expense tracking
			staleTime: 0, // Always consider data stale for immediate refetches after mutations
			gcTime: 1000 * 60 * 5, // 5 minutes - unused data cached for 5 minutes (reduced for faster updates)

			// Retry Strategy for long-running operations
			retry: (failureCount, error: unknown) => {
				// Don't retry on 4xx errors (client errors)
				if (error && typeof error === 'object' && 'response' in error) {
					const status = (error as { response?: { status?: number } }).response
						?.status;
					if (status && status >= 400 && status < 500) return false;
				}
				// Retry up to 3 times for server errors or network issues
				return failureCount < 3;
			},
			retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with max 30s

			// Refetch Configuration - optimized for real-time updates
			refetchOnWindowFocus: true, // Enable to catch updates from other tabs/devices
			refetchOnReconnect: true, // Refetch when reconnecting
			refetchOnMount: true, // Always refetch on component mount for fresh data

			// Network Mode - continue showing cached data even when offline
			networkMode: 'offlineFirst',

			// Performance optimization
			refetchInterval: false, // Disable automatic polling (use manual refetch after mutations)
			structuralSharing: true, // Enable structural sharing for better performance
		},
		mutations: {
			retry: 1, // Retry failed mutations once
			networkMode: 'online', // Only run mutations when online
		},
	},
});

function App() {
	return (
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<BrowserRouter>
						<NetworkStatusIndicator />
						<PWAUpdatePrompt />
						<PWAInstallPrompt />
						<Routes>
							<Route path="/login" element={<LoginPage />} />
							<Route path="/register" element={<RegisterPage />} />
							<Route path="/forgot-password" element={<ForgotPasswordPage />} />
							<Route path="/reset-password" element={<ResetPasswordPage />} />
							<Route path="/auth/callback" element={<AuthCallback />} />
							<Route
								path="/privacy"
								element={
									<Suspense fallback={<PageLoader />}>
										<PrivacyPage />
									</Suspense>
								}
							/>
							<Route
								path="/terms"
								element={
									<Suspense fallback={<PageLoader />}>
										<TermsPage />
									</Suspense>
								}
							/>
							<Route
								path="/security"
								element={
									<Suspense fallback={<PageLoader />}>
										<SecurityPage />
									</Suspense>
								}
							/>

							<Route
								path="/"
								element={
									<ProtectedRoute>
										<Layout />
									</ProtectedRoute>
								}
							>
								<Route index element={<Navigate to="/dashboard" replace />} />
								<Route
									path="dashboard"
									element={
										<Suspense fallback={<PageLoader />}>
											<DashboardPage />
										</Suspense>
									}
								/>
								<Route
									path="expenses"
									element={
										<Suspense fallback={<PageLoader />}>
											<ExpensesPage />
										</Suspense>
									}
								/>
								<Route
									path="categories"
									element={
										<Suspense fallback={<PageLoader />}>
											<CategoriesPage />
										</Suspense>
									}
								/>
								{/* <Route
									path="budgets"
									element={
										<Suspense fallback={<PageLoader />}>
											<BudgetsPage />
										</Suspense>
									}
								/> */}
								<Route
									path="profile"
									element={
										<Suspense fallback={<PageLoader />}>
											<ProfilePage />
										</Suspense>
									}
								/>
							</Route>

							<Route path="*" element={<Navigate to="/dashboard" replace />} />
						</Routes>
					</BrowserRouter>
					<Toaster />
				</AuthProvider>
				{/* React Query DevTools - only shows in development */}
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</ErrorBoundary>
	);
}

export default App;
