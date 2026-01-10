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
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

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
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [showEmailVerification, setShowEmailVerification] = useState(false);
	const { register } = useAuth();
	const navigate = useNavigate();

	// Set document title and meta description
	useEffect(() => {
		document.title = 'Sign Up - Expenser | Create Your Free Account';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'Create a free Expenser account to start tracking your expenses, managing budgets, and gaining financial insights.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Create a free Expenser account to start tracking your expenses, managing budgets, and gaining financial insights.';
			document.head.appendChild(meta);
		}
	}, []);

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

	// Auto-capitalize name
	const handleNameChange = (value: string) => {
		const capitalized = value
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
		setName(capitalized);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		// Validate terms acceptance
		if (!acceptedTerms) {
			const errorMsg =
				'You must accept the Terms of Service and Privacy Policy';
			setError(errorMsg);
			toast({
				variant: 'destructive',
				title: '✗ Validation error',
				description: errorMsg,
			});
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

		// Auto-trim whitespace
		const trimmedName = name.trim();
		const trimmedEmail = email.trim();

		try {
			await register(trimmedName, trimmedEmail, password);

			// Show email verification notice
			setShowEmailVerification(true);
			toast({
				variant: 'success',
				title: '✓ Account created',
				description: 'Welcome! Check your email for important updates.',
			});
			setTimeout(() => navigate('/dashboard'), 1500);
		} catch (err: unknown) {
			let errorMessage =
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

			// Better rate limiting feedback
			if (
				errorMessage.toLowerCase().includes('too many') ||
				errorMessage.toLowerCase().includes('rate limit')
			) {
				errorMessage =
					'Too many registration attempts. Please try again in a few minutes.';
			}

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
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
			<Card
				id="register-form"
				className="w-full max-w-md animate-in fade-in duration-300"
			>
				<CardHeader className="space-y-1">
					<CardTitle className="text-3xl font-bold text-center">
						Create Account
					</CardTitle>
					<CardDescription className="text-center">
						Enter your details to get started
					</CardDescription>
					<p className="text-xs text-center text-gray-500 mt-2">
						Join thousands tracking expenses smarter
					</p>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{showEmailVerification && (
							<div
								role="status"
								aria-live="polite"
								className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm"
							>
								<p className="font-medium mb-1">📧 Check your email</p>
								<p>
									We've sent you important account information and tips to get
									started.
								</p>
							</div>
						)}
						{error && (
							<div
								role="alert"
								aria-live="assertive"
								className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
							>
								{error}
							</div>
						)}

						<GoogleButton text="Sign up with Google" />

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-muted-foreground">
									Or sign up with email
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="name" className="text-sm">
								Name
							</Label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={e => handleNameChange(e.target.value)}
								required
								disabled={isLoading}
								className="h-10"
								autoFocus
								autoComplete="name"
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
									onChange={e => handlePasswordChange(e.target.value)}
									required
									disabled={isLoading}
									className="h-10 pr-10"
									aria-describedby="password-requirements"
									autoComplete="new-password"
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
							<div
								id="password-requirements"
								className="text-xs text-gray-600 space-y-0.5"
							>
								<p>• At least 6 characters (8+ recommended)</p>
								<p>
									• Mix of uppercase and lowercase letters for better security
								</p>
								<p>
									• Include numbers and special characters for strongest
									protection
								</p>
							</div>
							{passwordStrength && (
								<div className="space-y-1" aria-live="polite">
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
									className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
									disabled={isLoading}
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

						<div className="flex items-start space-x-2">
							<Checkbox
								id="terms"
								checked={acceptedTerms}
								onCheckedChange={checked =>
									setAcceptedTerms(checked as boolean)
								}
								disabled={isLoading}
								required
								aria-describedby="terms-description"
							/>
							<label
								id="terms-description"
								htmlFor="terms"
								className="text-xs text-gray-600 leading-relaxed cursor-pointer"
							>
								I agree to the{' '}
								<Link to="/terms" className="text-primary hover:underline">
									Terms of Service
								</Link>
								,{' '}
								<Link to="/privacy" className="text-primary hover:underline">
									Privacy Policy
								</Link>
								, and{' '}
								<Link to="/security" className="text-primary hover:underline">
									Security Practices
								</Link>
								.
							</label>
						</div>

						<Button
							type="submit"
							className="w-full h-10"
							disabled={isLoading || !acceptedTerms}
						>
							{isLoading ? 'Creating account...' : 'Sign Up'}
						</Button>

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
