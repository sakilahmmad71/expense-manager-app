import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/lib/services';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordData {
	email: string;
}

interface ResetPasswordData {
	token: string;
	newPassword: string;
}

/**
 * Hook for forgot password mutation with React Query
 */
export const useForgotPasswordMutation = () => {
	return useMutation({
		mutationFn: async ({ email }: ForgotPasswordData) => {
			const response = await authAPI.forgotPassword({ email });
			return response.data;
		},
		onSuccess: () => {
			toast.success('Reset link sent', {
				description: 'Check your email for password reset instructions.',
			});
		},
		onError: (error: unknown) => {
			const axiosError = error as { response?: { data?: { error?: string } } };
			let errorMessage =
				axiosError.response?.data?.error ||
				'Failed to send reset link. Please try again.';

			// Better rate limiting feedback
			if (
				errorMessage.toLowerCase().includes('too many') ||
				errorMessage.toLowerCase().includes('rate limit')
			) {
				errorMessage =
					'Too many reset requests. Please try again in a few minutes.';
			}

			toast.error('Request failed', {
				description: errorMessage,
			});
		},
		retry: 1,
	});
};

/**
 * Hook for reset password mutation with React Query
 */
export const useResetPasswordMutation = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async ({ token, newPassword }: ResetPasswordData) => {
			const response = await authAPI.resetPassword({ token, newPassword });
			return response.data;
		},
		onSuccess: () => {
			toast.success('Password reset successful', {
				description: 'Your password has been reset. Redirecting to login...',
			});

			// Redirect to login after 2 seconds
			setTimeout(() => navigate('/login'), 2000);
		},
		onError: (error: unknown) => {
			const axiosError = error as { response?: { data?: { error?: string } } };
			let errorMessage =
				axiosError.response?.data?.error ||
				'Failed to reset password. Please try again or request a new reset link.';

			// Better rate limiting feedback
			if (
				errorMessage.toLowerCase().includes('too many') ||
				errorMessage.toLowerCase().includes('rate limit')
			) {
				errorMessage =
					'Too many reset attempts. Please try again in a few minutes.';
			}

			toast.error('Reset failed', {
				description: errorMessage,
			});
		},
		retry: 1,
	});
};
