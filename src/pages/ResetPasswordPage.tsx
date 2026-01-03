import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { authAPI } from '@/lib/services';
import { CheckCircle2, Eye, EyeOff, KeyRound, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export const ResetPasswordPage = () => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] =
		useState<PasswordStrength | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		// Set document title and meta description
		document.title = 'Reset Password - Expenser | Set New Password';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'Reset your Expenser password by entering a new secure password.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Reset your Expenser password by entering a new secure password.';
			document.head.appendChild(meta);
		}

		// Get token from URL
		const tokenFromUrl = searchParams.get('token');
		if (!tokenFromUrl) {
			setError(
				'Invalid or missing reset token. Please request a new reset link.'
			);
		} else {
			setToken(tokenFromUrl);
		}
	}, [searchParams]);

	const calculatePasswordStrength = (pwd: string): PasswordStrength => {
		if (pwd.length === 0) return 'weak';
		let strength = 0;
		if (pwd.length >= 8) strength++;
		if (pwd.length >= 12) strength++;
		if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
		if (/\d/.test(pwd)) strength++;
		if (/[^a-zA-Z\d]/.test(pwd)) strength++;
		if (strength <= 2) return 'weak';
		if (strength <= 4) return 'medium';
		return 'strong';
	};

	const handlePasswordChange = (value: string) => {
		setPassword(value);
		if (value.length > 0) {
			setPasswordStrength(calculatePasswordStrength(value));
		} else {
			setPasswordStrength(null);
		}
	};

	const getPasswordStrengthColor = () => {
		switch (passwordStrength) {
			case 'weak':
				return 'bg-red-500';
			case 'medium':
				return 'bg-yellow-500';
			case 'strong':
				return 'bg-green-500';
			default:
				return 'bg-gray-200';
		}
	};

	const getPasswordStrengthWidth = () => {
		switch (passwordStrength) {
			case 'weak':
				return 'w-1/3';
			case 'medium':
				return 'w-2/3';
			case 'strong':
				return 'w-full';
			default:
				return 'w-0';
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!token) {
			setError(
				'Invalid or missing reset token. Please request a new reset link.'
			);
			return;
		}

		if (password !== confirmPassword) {
			const errorMsg = 'Passwords do not match';
			setError(errorMsg);
			toast({
				variant: 'destructive',
				title: '✗ Validation error',
				description: errorMsg,
			});
			return;
		}

		if (password.length < 6) {
			const errorMsg = 'Password must be at least 6 characters';
			setError(errorMsg);
			toast({
				variant: 'destructive',
				title: '✗ Validation error',
				description: errorMsg,
			});
			return;
		}

		setIsLoading(true);

		try {
			await authAPI.resetPassword({ token, newPassword: password });

			setIsSuccess(true);
			toast({
				variant: 'success',
				title: '✓ Password reset successful',
				description: 'Your password has been reset. Redirecting to login...',
			});

			// Redirect to login after 2 seconds
			setTimeout(() => navigate('/login'), 2000);
		} catch (err: unknown) {
			let errorMessage =
				(err as { response?: { data?: { error?: string } } }).response?.data
					?.error ||
				'Failed to reset password. Please try again or request a new reset link.';

			// Better rate limiting feedback
			if (
				errorMessage.toLowerCase().includes('too many') ||
				errorMessage.toLowerCase().includes('rate limit')
			) {
				errorMessage =
					'Too many reset attempts. Please try again in a few minutes.';
			}

			setError(errorMessage);
			toast({
				variant: 'destructive',
				title: '✗ Reset failed',
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
			<Card
				id="reset-password-form"
				className="w-full max-w-md animate-in fade-in duration-300"
			>
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-4">
						<div className="p-3 bg-blue-100 rounded-full">
							{isSuccess ? (
								<CheckCircle2 className="h-8 w-8 text-green-600" />
							) : (
								<KeyRound className="h-8 w-8 text-blue-600" />
							)}
						</div>
					</div>
					<CardTitle className="text-3xl font-bold text-center">
						Reset Password
					</CardTitle>
					<CardDescription className="text-center">
						{isSuccess
							? 'Password reset successful'
							: 'Enter your new password below'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isSuccess ? (
						<div className="space-y-4">
							<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
								<p className="font-medium mb-1">✓ Success!</p>
								<p>
									Your password has been reset successfully. You can now log in
									with your new password.
								</p>
							</div>

							<div className="text-center">
								<p className="text-sm text-gray-600">
									Redirecting to login page...
								</p>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div
									role="alert"
									aria-live="assertive"
									className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
								>
									{error}
								</div>
							)}

							{!token && (
								<div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md text-sm">
									<p className="font-medium mb-1">⚠ Invalid Reset Link</p>
									<p>
										The reset link is invalid or missing. Please request a new
										password reset link.
									</p>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm">
									New Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										placeholder="••••••••"
										value={password}
										onChange={e => handlePasswordChange(e.target.value)}
										required
										disabled={isLoading || !token}
										className="h-10 pr-10"
										autoFocus
										aria-describedby="password-requirements"
										autoComplete="new-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
										disabled={isLoading || !token}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
								<div
									id="password-requirements"
									className="text-xs text-gray-600 space-y-0.5"
								>
									<p>• At least 6 characters (8+ recommended)</p>
									<p>• Mix of uppercase and lowercase letters</p>
									<p>• Include numbers and special characters</p>
								</div>
								{passwordStrength && (
									<div className="space-y-1" aria-live="polite">
										<div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
											<div
												className={`h-full transition-all duration-300 ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}
											/>
										</div>
										<p
											className={`text-xs ${
												passwordStrength === 'weak'
													? 'text-red-600'
													: passwordStrength === 'medium'
														? 'text-yellow-600'
														: 'text-green-600'
											}`}
										>
											Password strength:{' '}
											{passwordStrength.charAt(0).toUpperCase() +
												passwordStrength.slice(1)}
										</p>
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword" className="text-sm">
									Confirm New Password
								</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder="••••••••"
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
										required
										disabled={isLoading || !token}
										className="h-10 pr-10"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
										disabled={isLoading || !token}
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
								{confirmPassword && (
									<div
										className="flex items-center gap-1.5 text-xs"
										aria-live="polite"
									>
										{confirmPassword === password ? (
											<>
												<CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
												<span className="text-green-600">Passwords match</span>
											</>
										) : (
											<>
												<XCircle className="h-3.5 w-3.5 text-red-600" />
												<span className="text-red-600">
													Passwords don't match
												</span>
											</>
										)}
									</div>
								)}
							</div>

							<Button
								type="submit"
								className="w-full h-10"
								disabled={isLoading || !token}
							>
								{isLoading ? 'Resetting...' : 'Reset Password'}
							</Button>

							<div className="text-center">
								<p className="text-sm text-gray-600">
									Remember your password?{' '}
									<Link
										to="/login"
										className="text-primary font-medium hover:underline"
									>
										Back to login
									</Link>
								</p>
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
