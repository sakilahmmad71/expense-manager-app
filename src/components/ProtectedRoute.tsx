import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { token, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<div className='text-lg'>Loading...</div>
			</div>
		);
	}

	if (!token) {
		return <Navigate to='/login' replace />;
	}

	return <>{children}</>;
};
