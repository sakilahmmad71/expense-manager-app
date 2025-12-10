import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProfilePage } from './pages/ProfilePage';
import { Toaster } from './components/ui/toaster';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/login' element={<LoginPage />} />
					<Route path='/register' element={<RegisterPage />} />

					<Route
						path='/'
						element={
							<ProtectedRoute>
								<Layout />
							</ProtectedRoute>
						}>
						<Route index element={<Navigate to='/dashboard' replace />} />
						<Route path='dashboard' element={<DashboardPage />} />
						<Route path='expenses' element={<ExpensesPage />} />
						<Route path='categories' element={<CategoriesPage />} />
						<Route path='profile' element={<ProfilePage />} />
					</Route>

					<Route path='*' element={<Navigate to='/dashboard' replace />} />
				</Routes>
			</BrowserRouter>
			<Toaster />
		</AuthProvider>
	);
}

export default App;
