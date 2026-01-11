import { useMutation } from '@tanstack/react-query';
import { authAPI, User } from '@/lib/services';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface LoginCredentials {
	email: string;
	password: string;
	rememberMe?: boolean;
}

interface RegisterCredentials {
	name: string;
	email: string;
	password: string;
}

interface UpdateProfileData {
	name: string;
}

interface ChangePasswordData {
	currentPassword: string;
	newPassword: string;
}

/**
 * Hook for login mutation with React Query
 */
export const useLoginMutation = () => {
	const navigate = useNavigate();
	const { setToken, setUser, setIsAuthenticated } = useAuth();

	return useMutation({
		mutationFn: async ({ email, password }: LoginCredentials) => {
			const response = await authAPI.login({ email, password });
			return response.data;
		},
		onSuccess: (data, variables) => {
			const { user, token } = data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));

			// Save email if Remember Me is checked
			if (variables.rememberMe) {
				localStorage.setItem('rememberedEmail', variables.email);
			} else {
				localStorage.removeItem('rememberedEmail');
			}

			setToken(token);
			setUser(user);
			setIsAuthenticated(true);

			toast.success('Login successful', {
				description: 'Welcome back! Redirecting to dashboard...',
			});

			setTimeout(() => navigate('/dashboard'), 500);
		},
		onError: (error: unknown) => {
			const axiosError = error as { response?: { data?: { error?: string } } };
			let errorMessage =
				axiosError.response?.data?.error ||
				'Failed to login. Please try again.';

			// Better rate limiting feedback
			if (
				errorMessage.toLowerCase().includes('too many') ||
				errorMessage.toLowerCase().includes('rate limit')
			) {
				errorMessage =
					'Too many login attempts. Please try again in a few minutes.';
			}

			toast.error('Login failed', {
				description: errorMessage,
			});
		},
		retry: 1,
	});
};

/**
 * Hook for register mutation with React Query
 */
export const useRegisterMutation = () => {
	const navigate = useNavigate();
	const { setToken, setUser, setIsAuthenticated } = useAuth();

	return useMutation({
		mutationFn: async ({ name, email, password }: RegisterCredentials) => {
			const response = await authAPI.register({ name, email, password });
			return response.data;
		},
		onSuccess: data => {
			const { user, token } = data;

			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));

			setToken(token);
			setUser(user);
			setIsAuthenticated(true);

			toast.success('Account created', {
				description: 'Welcome! Check your email for important updates.',
			});

			setTimeout(() => navigate('/dashboard'), 1500);
		},
		onError: (error: unknown) => {
			const axiosError = error as {
				response?: { data?: { error?: string } };
			};
			let errorMessage =
				String(axiosError?.response?.data?.error) ||
				'Failed to register. Please try again.';
			if (
				errorMessage.toLowerCase().includes('too many') ||
				errorMessage.toLowerCase().includes('rate limit')
			) {
				errorMessage =
					'Too many registration attempts. Please try again in a few minutes.';
			}

			toast.error('Registration failed', {
				description: errorMessage,
			});
		},
		retry: false, // Don't retry registration attempts
	});
};

/**
 * Hook for update profile mutation with React Query
 */
export const useUpdateProfileMutation = () => {
	const { updateUser: updateAuthUser } = useAuth();

	return useMutation({
		mutationFn: async (data: UpdateProfileData) => {
			const response = await authAPI.updateProfile(data);
			return response.data;
		},
		onMutate: async (newData: UpdateProfileData) => {
			// Optimistically update user in localStorage and context
			const previousUser = JSON.parse(localStorage.getItem('user') || '{}');
			const updatedUser = { ...previousUser, ...newData };

			localStorage.setItem('user', JSON.stringify(updatedUser));
			updateAuthUser(updatedUser as User);

			return { previousUser };
		},
		onSuccess: data => {
			const { user } = data;

			// Update with server response
			localStorage.setItem('user', JSON.stringify(user));
			updateAuthUser(user);

			toast.success('Profile updated', {
				description: 'Your profile has been updated successfully.',
			});
		},
		onError: (error: unknown, _variables, context) => {
			// Rollback on error
			if (context?.previousUser) {
				localStorage.setItem('user', JSON.stringify(context.previousUser));
				updateAuthUser(context.previousUser as User);
			}

			const axiosError = error as { response?: { data?: { error?: string } } };
			const errorMessage =
				axiosError.response?.data?.error || 'Failed to update profile';

			toast.error('Update failed', {
				description: errorMessage,
			});
		},
		retry: 1,
	});
};

/**
 * Hook for change password mutation with React Query
 */
export const useChangePasswordMutation = () => {
	return useMutation({
		mutationFn: async (data: ChangePasswordData) => {
			const response = await authAPI.changePassword(data);
			return response.data;
		},
		onSuccess: () => {
			toast.success('Password changed', {
				description: 'Your password has been changed successfully.',
			});
		},
		onError: (error: unknown) => {
			const axiosError = error as { response?: { data?: { error?: string } } };
			const errorMessage =
				axiosError.response?.data?.error || 'Failed to change password';

			toast.error('Change failed', {
				description: errorMessage,
			});
		},
		retry: false, // Don't retry password changes
	});
};
