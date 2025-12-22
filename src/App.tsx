import { Layout } from '@components/Layout';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { Toaster } from '@components/ui/toaster';
import { AuthProvider } from '@context/AuthContext';
import { CategoriesPage } from '@pages/CategoriesPage';
import { DashboardPage } from '@pages/DashboardPage';
import { ExpensesPage } from '@pages/ExpensesPage';
import { LoginPage } from '@pages/LoginPage';
import { ProfilePage } from '@pages/ProfilePage';
import { RegisterPage } from '@pages/RegisterPage';
import { PrivacyPage } from '@pages/PrivacyPage';
import { TermsPage } from '@pages/TermsPage';
import { SecurityPage } from '@pages/SecurityPage';
import AuthCallback from '@pages/AuthCallback';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Configure QueryClient with optimal defaults
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh for 5 minutes
			gcTime: 1000 * 60 * 30, // 30 minutes - unused data cached for 30 minutes (formerly cacheTime)
			retry: 3, // Retry failed requests 3 times
			refetchOnWindowFocus: true, // Refetch when window regains focus
			refetchOnReconnect: true, // Refetch when reconnecting
			refetchOnMount: true, // Refetch on component mount if data is stale
		},
		mutations: {
			retry: 1, // Retry failed mutations once
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/auth/callback" element={<AuthCallback />} />

						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Layout />
								</ProtectedRoute>
							}
						>
							<Route index element={<Navigate to="/dashboard" replace />} />
							<Route path="dashboard" element={<DashboardPage />} />
							<Route path="expenses" element={<ExpensesPage />} />
							<Route path="categories" element={<CategoriesPage />} />
							<Route path="profile" element={<ProfilePage />} />
							<Route path="privacy" element={<PrivacyPage />} />
							<Route path="terms" element={<TermsPage />} />
							<Route path="security" element={<SecurityPage />} />
						</Route>

						<Route path="*" element={<Navigate to="/dashboard" replace />} />
					</Routes>
				</BrowserRouter>
				<Toaster />
			</AuthProvider>
			{/* React Query DevTools - only shows in development */}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
