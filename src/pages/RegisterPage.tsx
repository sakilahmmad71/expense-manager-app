import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRegisterMutation } from '@/hooks/useAuthMutations';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoogleButton from '@/components/GoogleButton';
import { Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

type PasswordStrength = 'weak' | 'medium' | 'strong';

const registerFormSchema = z
	.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string(),
		acceptedTerms: z.boolean().refine(val => val === true, {
			message: 'You must accept the Terms of Service and Privacy Policy',
		}),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const RegisterPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] =
		useState<PasswordStrength | null>(null);
	const {
		mutate: registerMutation,
		isPending,
		error,
		isError,
	} = useRegisterMutation();

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			acceptedTerms: false,
		},
	});

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

	const calculatePasswordStrength = (password: string): PasswordStrength => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (password.length >= 12) strength++;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
		if (/\d/.test(password)) strength++;
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

		if (strength <= 2) return 'weak';
		if (strength <= 4) return 'medium';
		return 'strong';
	};

	const handlePasswordChange = (value: string) => {
		if (value.length > 0) {
			setPasswordStrength(calculatePasswordStrength(value));
		} else {
			setPasswordStrength(null);
		}
	};

	const onSubmit = (values: RegisterFormValues) => {
		registerMutation({
			name: values.name.trim(),
			email: values.email.trim(),
			password: values.password.trim(),
		});
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
						Start your journey to better financial management
					</CardDescription>
					<p className="text-xs text-center text-gray-500 mt-2">
						Join thousands already using Expenser
					</p>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{isError && error ? (
								<Alert variant="destructive">
									<AlertDescription>
										{String(
											(
												error as Error & {
													response?: { data?: { error?: string } };
												}
											)?.response?.data?.error ||
												(error as Error)?.message ||
												'Registration failed. Please try again.'
										)}
									</AlertDescription>
								</Alert>
							) : null}
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

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="John Doe"
												autoComplete="name"
												disabled={isPending}
												className="h-10"
												{...field}
												onChange={e => {
													const value = e.target.value;
													// Auto-capitalize
													const capitalized = value
														.split(' ')
														.map(
															word =>
																word.charAt(0).toUpperCase() +
																word.slice(1).toLowerCase()
														)
														.join(' ');
													field.onChange(capitalized);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="you@example.com"
												autoComplete="email"
												disabled={isPending}
												className="h-10"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? 'text' : 'password'}
													placeholder="••••••••"
													disabled={isPending}
													className="h-10 pr-10"
													{...field}
													onChange={e => {
														field.onChange(e);
														handlePasswordChange(e.target.value);
													}}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
													disabled={isPending}
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</FormControl>
										{passwordStrength && (
											<div className="space-y-1">
												<div className="flex gap-1">
													<div
														className={`h-1 flex-1 rounded ${
															passwordStrength === 'weak'
																? 'bg-red-500'
																: passwordStrength === 'medium'
																	? 'bg-yellow-500'
																	: 'bg-green-500'
														}`}
													/>
													<div
														className={`h-1 flex-1 rounded ${
															passwordStrength === 'medium'
																? 'bg-yellow-500'
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
												<p className="text-xs text-gray-500">
													Password strength:{' '}
													<span
														className={
															passwordStrength === 'weak'
																? 'text-red-500'
																: passwordStrength === 'medium'
																	? 'text-yellow-500'
																	: 'text-green-500'
														}
													>
														{passwordStrength}
													</span>
												</p>
											</div>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showConfirmPassword ? 'text' : 'password'}
													placeholder="••••••••"
													disabled={isPending}
													className="h-10 pr-10"
													{...field}
												/>
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword(!showConfirmPassword)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
													disabled={isPending}
												>
													{showConfirmPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="acceptedTerms"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isPending}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel className="text-sm font-normal cursor-pointer">
												I accept the{' '}
												<Link
													to="/terms"
													className="text-primary hover:underline font-medium"
												>
													Terms of Service
												</Link>{' '}
												and{' '}
												<Link
													to="/privacy"
													className="text-primary hover:underline font-medium"
												>
													Privacy Policy
												</Link>
											</FormLabel>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-full h-10"
								disabled={isPending}
							>
								{isPending ? 'Creating account...' : 'Create Account'}
							</Button>

							<div className="pt-4 border-t">
								<p className="text-center text-sm text-gray-600">
									Already have an account?{' '}
									<Link
										to="/login"
										className="text-primary font-medium hover:underline"
									>
										Sign in
									</Link>
								</p>
							</div>

							<div className="pt-2">
								<p className="text-center text-xs text-gray-500">
									Protected by industry-standard encryption.{' '}
									<Link to="/security" className="text-primary hover:underline">
										Learn more
									</Link>
								</p>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};
