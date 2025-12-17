import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/services';
import { Lock, Mail, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ProfilePage = () => {
	const { user, updateUser } = useAuth();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				password: '',
				confirmPassword: '',
			});
		}
	}, [user]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password && formData.password !== formData.confirmPassword) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Passwords do not match',
			});
			return;
		}

		setIsLoading(true);
		try {
			const updateData: {
				name: string;
				email: string;
				password?: string;
			} = {
				name: formData.name,
				email: formData.email,
			};

			if (formData.password) {
				updateData.password = formData.password;
			}

			const response = await authAPI.updateProfile(updateData);

			// Update the user in the auth context
			if (response.data.user) {
				updateUser(response.data.user);
			}

			toast({
				variant: 'success',
				title: 'Success',
				description: 'Profile updated successfully',
			});

			// Clear password fields
			setFormData({
				...formData,
				password: '',
				confirmPassword: '',
			});
		} catch (error: unknown) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					typeof error === 'object' &&
					error !== null &&
					'response' in error &&
					typeof error.response === 'object' &&
					error.response !== null &&
					'data' in error.response &&
					typeof error.response.data === 'object' &&
					error.response.data !== null &&
					'error' in error.response.data
						? String(error.response.data.error)
						: 'Failed to update profile',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
					Profile Settings
				</h1>
				<p className="text-sm sm:text-base text-gray-600">
					Manage your account information
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
						<User className="h-4 w-4 sm:h-5 sm:w-5" />
						Personal Information
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name" className="text-xs sm:text-sm">
								<span className="flex items-center gap-2">
									<User className="h-3 w-3 sm:h-4 sm:w-4" />
									Name
								</span>
							</Label>
							<Input
								id="name"
								name="name"
								type="text"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter your name"
								className="h-10"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-xs sm:text-sm">
								<span className="flex items-center gap-2">
									<Mail className="h-3 w-3 sm:h-4 sm:w-4" />
									Email
								</span>
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="Enter your email"
								className="h-10"
								required
							/>
						</div>

						<div className="border-t border-gray-200 my-6"></div>

						<div className="space-y-4">
							<h3 className="text-xs sm:text-sm font-semibold text-gray-700">
								Change Password (Optional)
							</h3>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-xs sm:text-sm">
									<span className="flex items-center gap-2">
										<Lock className="h-3 w-3 sm:h-4 sm:w-4" />
										New Password
									</span>
								</Label>
								<Input
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleInputChange}
									placeholder="Enter new password (leave blank to keep current)"
									className="h-10"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword" className="text-xs sm:text-sm">
									<span className="flex items-center gap-2">
										<Lock className="h-3 w-3 sm:h-4 sm:w-4" />
										Confirm New Password
									</span>
								</Label>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									placeholder="Confirm new password"
									className="h-10"
								/>
							</div>
						</div>

						<div className="flex justify-end pt-4">
							<Button
								type="submit"
								disabled={isLoading}
								size="sm"
								className="flex items-center gap-2 text-xs sm:text-sm"
							>
								<Save className="h-3 w-3 sm:h-4 sm:w-4" />
								{isLoading ? 'Saving...' : 'Save Changes'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base sm:text-lg">
						Account Information
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2 text-xs sm:text-sm">
						<div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
							<span className="text-gray-600">Account Created:</span>
							<span className="text-gray-900">
								{user?.createdAt
									? new Date(user.createdAt).toLocaleDateString()
									: 'N/A'}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
