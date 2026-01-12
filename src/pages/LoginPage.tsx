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
import { useLoginMutation } from '@/hooks/useAuthMutations';
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

const loginFormSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
	rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const {
		mutate: loginMutation,
		isPending,
		error,
		isError,
	} = useLoginMutation();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});

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
			form.setValue('email', savedEmail);
			form.setValue('rememberMe', true);
		}
	}, [form]);

	const onSubmit = (values: LoginFormValues) => {
		loginMutation({
			email: values.email.trim(),
			password: values.password.trim(),
			rememberMe: values.rememberMe,
		});
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
												'An error occurred'
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
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>

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
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center justify-between">
								<FormField
									control={form.control}
									name="rememberMe"
									render={({ field }) => (
										<FormItem className="flex items-center space-x-2 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
													disabled={isPending}
												/>
											</FormControl>
											<FormLabel className="text-sm font-medium cursor-pointer">
												Remember me
											</FormLabel>
										</FormItem>
									)}
								/>
								<Link
									to="/forgot-password"
									className="text-sm text-primary font-medium hover:underline"
								>
									Forgot password?
								</Link>
							</div>

							<Button
								type="submit"
								className="w-full h-10"
								disabled={isPending}
							>
								{isPending ? 'Logging in...' : 'Log In'}
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

							<div className="pt-4 border-t">
								<p className="text-center text-xs text-gray-500">
									By signing in, you agree to our{' '}
									<Link to="/terms" className="text-primary hover:underline">
										Terms
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
								</p>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};
