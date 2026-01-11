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
import { useForgotPasswordMutation } from '@/hooks/usePasswordReset';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const ForgotPasswordPage = () => {
	const [email, setEmail] = useState('');
	const {
		mutate: forgotPassword,
		isPending,
		isSuccess,
		error,
		isError,
	} = useForgotPasswordMutation();

	useEffect(() => {
		// Set document title and meta description
		document.title = 'Forgot Password - Expenser | Reset Your Password';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'Forgot your Expenser password? Enter your email to receive a password reset link.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Forgot your Expenser password? Enter your email to receive a password reset link.';
			document.head.appendChild(meta);
		}
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		forgotPassword({ email: email.trim() });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Card
				id="forgot-password-form"
				className="w-full max-w-md animate-in fade-in duration-300"
			>
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-4">
						<div className="p-3 bg-blue-100 rounded-full">
							<Mail className="h-8 w-8 text-blue-600" />
						</div>
					</div>
					<CardTitle className="text-3xl font-bold text-center">
						Forgot Password
					</CardTitle>
					<CardDescription className="text-center">
						{isSuccess
							? 'Check your email for the reset link'
							: 'Enter your email to receive a password reset link'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isSuccess ? (
						<div className="space-y-4">
							<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
								<p className="font-medium mb-1">✓ Email sent successfully</p>
								<p>
									If an account exists with <strong>{email}</strong>, you'll
									receive a password reset link shortly. Please check your email
									inbox and spam folder.
								</p>
							</div>

							<div className="text-center space-y-2">
								<p className="text-sm text-gray-600">
									Didn't receive the email?{' '}
									<Link
										to="/forgot-password"
										className="text-primary font-medium hover:underline"
										onClick={() => window.location.reload()}
									>
										Try again
									</Link>
								</p>
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
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							{isError && error ? (
								<div
									role="alert"
									aria-live="assertive"
									className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
								>
									{String(
										(
											error as Error & {
												response?: { data?: { error?: string } };
											}
										)?.response?.data?.error ||
											(error as Error)?.message ||
											'An error occurred'
									)}
								</div>
							) : null}
							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm">
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
									disabled={isPending}
									className="h-10"
									autoFocus
									autoComplete="email"
								/>
							</div>

							<Button
								type="submit"
								className="w-full h-10"
								disabled={isPending}
							>
								{isPending ? 'Sending...' : 'Send Reset Link'}
							</Button>

							<div className="text-center space-y-2">
								<p className="text-sm text-gray-600">
									Remember your password?{' '}
									<Link
										to="/login"
										className="text-primary font-medium hover:underline"
									>
										Back to login
									</Link>
								</p>
								<p className="text-sm text-gray-600">
									Don't have an account?{' '}
									<Link
										to="/register"
										className="text-primary font-medium hover:underline"
									>
										Sign up
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
