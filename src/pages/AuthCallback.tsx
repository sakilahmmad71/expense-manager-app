import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const AuthCallback = () => {
	const navigate = useNavigate();
	const { setToken, setUser, setIsAuthenticated } = useAuth();

	useEffect(() => {
		// Set document title and meta description
		document.title = 'Authenticating - Expenser | Signing You In';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'Completing your authentication with Expenser. Please wait while we sign you in.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Completing your authentication with Expenser. Please wait while we sign you in.';
			document.head.appendChild(meta);
		}

		const handleCallback = async () => {
			try {
				// Get token from URL parameters
				const params = new URLSearchParams(window.location.search);
				const token = params.get('token');
				const error = params.get('error');

				if (error) {
					toast.error(error);
					navigate('/login');
					return;
				}

				if (!token) {
					toast.error('Authentication failed. No token received.');
					navigate('/login');
					return;
				}

				// Store token in localStorage
				localStorage.setItem('token', token);

				// Fetch user information using the token
				const apiUrl =
					import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
				const response = await fetch(`${apiUrl}/auth/profile`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch user information');
				}

				const userData = await response.json();

				// Store user data
				localStorage.setItem('user', JSON.stringify(userData));
				setToken(token);
				setUser(userData);
				setIsAuthenticated(true);

				toast.success('Successfully logged in with Google!');
				navigate('/dashboard');
			} catch (error) {
				console.error('OAuth callback error:', error);
				toast.error('Authentication failed. Please try again.');
				navigate('/login');
			}
		};

		handleCallback();
	}, [navigate, setToken, setUser, setIsAuthenticated]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div
				id="auth-loading"
				className="text-center animate-in fade-in duration-300"
			>
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
				<p className="mt-4 text-gray-600">Completing authentication...</p>
			</div>
		</div>
	);
};

export default AuthCallback;
