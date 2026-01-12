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
import { useResetPasswordMutation } from '@/hooks/usePasswordReset';
import { CheckCircle2, Eye, EyeOff, KeyRound, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export const ResetPasswordPage = () => {
	const [searchParams] = useSearchParams();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [validationError, setValidationError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] =
		useState<PasswordStrength | null>(null);
	const [token, setToken] = useState<string | null>(null);

	const {
		mutate: resetPassword,
		isPending,
		isSuccess,
		error,
		isError,
	} = useResetPasswordMutation();

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
			setValidationError(
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError('');

		if (!token) {
			setValidationError(
				'Invalid or missing reset token. Please request a new reset link.'
			);
			return;
		}

		if (password !== confirmPassword) {
			setValidationError('Passwords do not match');
			return;
		}

		if (password.length < 6) {
			setValidationError('Password must be at least 6 characters');
			return;
		}

		resetPassword({ token, newPassword: password });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
							{validationError || (isError && error) ? (
								<div
									role="alert"
									aria-live="assertive"
									className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
								>
									{validationError ||
										String(
											(
												error as Error & {
													response?: { data?: { error?: string } };
												}
											)?.response?.data?.error ||
												(error as Error)?.message ||
												'An error occurred'
										)}
									<p>
										The reset link is invalid or missing. Please request a new
										password reset link.
									</p>
								</div>
							) : null}

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
										disabled={isPending || !token}
										className="h-10 pr-10"
										autoFocus
										aria-describedby="password-requirements"
										autoComplete="new-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
										disabled={isPending || !token}
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
										disabled={isPending || !token}
										className="h-10 pr-10"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
										disabled={isPending || !token}
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
								disabled={isPending || !token}
							>
								{isPending ? 'Resetting...' : 'Reset Password'}
							</Button>

							<div className="mt-4 text-center">
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
