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
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleButton from '@/components/GoogleButton';
import { Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export const LoginPage = () => {
	const { toast } = useToast();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		// Set document title and meta description
		document.title = 'Login - Expenser | Sign In to Your Account';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'Sign in to your Expenser account to track expenses, manage budgets, and gain insights into your spending habits.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Sign in to your Expenser account to track expenses, manage budgets, and gain insights into your spending habits.';
			document.head.appendChild(meta);
		}

		const savedEmail = localStorage.getItem('rememberedEmail');
		if (savedEmail) {
			setEmail(savedEmail);
			setRememberMe(true);
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		// Auto-trim whitespace
		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		try {
			await login(trimmedEmail, trimmedPassword);

			// Save email if Remember Me is checked
			if (rememberMe) {
				localStorage.setItem('rememberedEmail', email);
			} else {
				localStorage.removeItem('rememberedEmail');
			}

			toast({
				variant: 'success',
				title: '✓ Login successful',
				description: 'Welcome back! Redirecting to dashboard...',
			});
			setTimeout(() => navigate('/dashboard'), 500);
		} catch (err: unknown) {
			let errorMessage =
				(err as { response?: { data?: { error?: string } } }).response?.data
					?.error || 'Failed to login. Please try again.';

			// Better rate limiting feedback
			if (
				errorMessage.toLowerCase().includes('too many') ||
				errorMessage.toLowerCase().includes('rate limit')
			) {
				errorMessage =
					'Too many login attempts. Please try again in a few minutes.';
			}

			setError(errorMessage);
			toast({
				variant: 'destructive',
				title: '✗ Login failed',
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
			<Card
				id="login-form"
				className="w-full max-w-md animate-in fade-in duration-300"
			>
				<CardHeader className="space-y-1">
					<CardTitle className="text-3xl font-bold text-center">
						Welcome Back
					</CardTitle>
					<CardDescription className="text-center">
						Enter your credentials to access your account
					</CardDescription>
					<p className="text-xs text-center text-gray-500 mt-2">
						Join thousands managing their finances with Expenser
					</p>
				</CardHeader>
				<CardContent>
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

						<GoogleButton />

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-muted-foreground">
									Or continue with email
								</span>
							</div>
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
								autoFocus
								autoComplete="email"
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
									onChange={e => setPassword(e.target.value)}
									required
									disabled={isLoading}
									className="h-10 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
									disabled={isLoading}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="remember"
									checked={rememberMe}
									onCheckedChange={checked => setRememberMe(checked as boolean)}
									disabled={isLoading}
								/>
								<label
									htmlFor="remember"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
								>
									Remember me
								</label>
							</div>
							<Link
								to="/forgot-password"
								className="text-sm text-primary font-medium hover:underline"
							>
								Forgot password?
							</Link>
						</div>

						<Button type="submit" className="w-full h-10" disabled={isLoading}>
							{isLoading ? 'Logging in...' : 'Log In'}
						</Button>

						<p className="text-center text-sm text-gray-600">
							Don't have an account?{' '}
							<Link
								to="/register"
								className="text-primary font-medium hover:underline"
							>
								Sign up
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
