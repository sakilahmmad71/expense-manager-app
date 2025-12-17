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
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleButton from '@/components/GoogleButton';
import { Eye, EyeOff } from 'lucide-react';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export const RegisterPage = () => {
	const { toast } = useToast();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] =
		useState<PasswordStrength | null>(null);
	const { register } = useAuth();
	const navigate = useNavigate();

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

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
			await register(name, email, password);
			toast({
				variant: 'success',
				title: '✓ Account created',
				description: 'Welcome! Redirecting to dashboard...',
			});
			setTimeout(() => navigate('/dashboard'), 500);
		} catch (err: unknown) {
			const errorMessage =
				typeof err === 'object' &&
				err !== null &&
				'response' in err &&
				typeof err.response === 'object' &&
				err.response !== null &&
				'data' in err.response &&
				typeof err.response.data === 'object' &&
				err.response.data !== null &&
				'error' in err.response.data
					? String(err.response.data.error)
					: 'Failed to register. Please try again.';
			setError(errorMessage);
			toast({
				variant: 'destructive',
				title: '✗ Registration failed',
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-3xl font-bold text-center">
						Create Account
					</CardTitle>
					<CardDescription className="text-center">
						Enter your details to get started
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
								{error}
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="name" className="text-sm">
								Name
							</Label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={e => setName(e.target.value)}
								required
								disabled={isLoading}
								className="h-10"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								disabled={isLoading}
								className="h-10"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									value={password}
									onChange={e => handlePasswordChange(e.target.value)}
									required
									disabled={isLoading}
									className="h-10 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									disabled={isLoading}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
							{passwordStrength && (
								<div className="space-y-1">
									<div className="flex gap-1">
										<div
											className={`h-1 flex-1 rounded ${
												passwordStrength === 'weak'
													? 'bg-red-500'
													: passwordStrength === 'medium'
														? 'bg-orange-500'
														: 'bg-green-500'
											}`}
										/>
										<div
											className={`h-1 flex-1 rounded ${
												passwordStrength === 'medium'
													? 'bg-orange-500'
													: passwordStrength === 'strong'
														? 'bg-green-500'
														: 'bg-gray-200'
											}`}
										/>
										<div
											className={`h-1 flex-1 rounded ${
												passwordStrength === 'strong'
													? 'bg-green-500'
													: 'bg-gray-200'
											}`}
										/>
									</div>
									<p
										className={`text-xs ${
											passwordStrength === 'weak'
												? 'text-red-600'
												: passwordStrength === 'medium'
													? 'text-orange-600'
													: 'text-green-600'
										}`}
									>
										Password strength: {passwordStrength}
									</p>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="text-sm">
								Confirm Password
							</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder="••••••••"
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
									required
									disabled={isLoading}
									className="h-10 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									disabled={isLoading}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						<Button type="submit" className="w-full h-10" disabled={isLoading}>
							{isLoading ? 'Creating account...' : 'Sign Up'}
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>

						<GoogleButton text="Sign up with Google" />

						<p className="text-center text-sm text-gray-600">
							Already have an account?{' '}
							<Link
								to="/login"
								className="text-primary font-medium hover:underline"
							>
								Log in
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
