import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import {
	useUpdateProfileMutation,
	useChangePasswordMutation,
} from '@/hooks/useAuthMutations';
import { Lock, Mail, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ProfilePage = () => {
	const { user } = useAuth();
	const { mutate: updateProfile, isPending: isLoadingProfile } =
		useUpdateProfileMutation();
	const { mutate: changePassword, isPending: isLoadingPassword } =
		useChangePasswordMutation();

	const [profileData, setProfileData] = useState({
		name: '',
	});
	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	useEffect(() => {
		// Set document title and meta description
		document.title = 'Profile Settings - Expenser | Manage Your Account';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'Manage your Expenser account settings, update personal information, and change your password.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Manage your Expenser account settings, update personal information, and change your password.';
			document.head.appendChild(meta);
		}

		if (user) {
			setProfileData({
				name: user.name || '',
			});
		}
	}, [user]);

	const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProfileData({
			...profileData,
			[e.target.name]: e.target.value,
		});
	};

	const handlePasswordInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setPasswordData({
			...passwordData,
			[e.target.name]: e.target.value,
		});
	};

	const handleProfileSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateProfile({ name: profileData.name });
	};

	const handlePasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			return; // Error is handled by form validation
		}

		changePassword(
			{
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
			},
			{
				onSuccess: () => {
					// Clear password fields on success
					setPasswordData({
						currentPassword: '',
						newPassword: '',
						confirmPassword: '',
					});
				},
			}
		);
	};

	return (
		<div className="py-6 px-2 sm:px-6 md:container md:mx-auto lg:px-8 min-h-screen">
			<div className="space-y-6 animate-in fade-in duration-300">
				{/* Breadcrumb Navigation */}
				<PageBreadcrumb items={[{ label: 'Profile Settings' }]} />

				<div id="profile-header" className="space-y-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Profile Settings
						</h1>
						<p className="text-muted-foreground mt-1">
							Manage your account information
						</p>
					</div>
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16">
							<AvatarImage src="" alt={user?.name || 'User'} />
							<AvatarFallback className="text-lg bg-gray-900 text-white">
								{user?.name?.charAt(0).toUpperCase() || 'U'}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium text-gray-900">{user?.name}</p>
							<p className="text-sm text-gray-500">{user?.email}</p>
						</div>
					</div>
				</div>

				<Separator />

				<Card id="personal-information">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<User className="h-4 w-4 sm:h-5 sm:w-5" />
							Personal Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleProfileSubmit} className="space-y-4">
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
									value={profileData.name}
									onChange={handleProfileInputChange}
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
									value={user?.email || ''}
									readOnly
									disabled
									className="h-10 bg-gray-100 cursor-not-allowed"
								/>
								<p className="text-xs text-muted-foreground">
									Email cannot be changed for security reasons
								</p>
							</div>

							<div className="flex justify-end pt-4">
								<Button
									type="submit"
									disabled={isLoadingProfile}
									className="flex items-center gap-2"
								>
									<Save className="h-4 w-4" />
									{isLoadingProfile ? 'Saving...' : 'Save Changes'}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card id="password-change">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<Lock className="h-4 w-4 sm:h-5 sm:w-5" />
							Change Password
						</CardTitle>
					</CardHeader>
					<CardContent>
						{user?.authProvider !== 'local' ? (
							<div className="text-sm text-muted-foreground">
								You are signed in with {user?.authProvider}. Password change is
								not available for OAuth accounts.
							</div>
						) : (
							<form onSubmit={handlePasswordSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label
										htmlFor="currentPassword"
										className="text-xs sm:text-sm"
									>
										<span className="flex items-center gap-2">
											<Lock className="h-3 w-3 sm:h-4 sm:w-4" />
											Current Password
										</span>
									</Label>
									<Input
										id="currentPassword"
										name="currentPassword"
										type="password"
										value={passwordData.currentPassword}
										onChange={handlePasswordInputChange}
										placeholder="Enter your current password"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="newPassword" className="text-xs sm:text-sm">
										<span className="flex items-center gap-2">
											<Lock className="h-3 w-3 sm:h-4 sm:w-4" />
											New Password
										</span>
									</Label>
									<Input
										id="newPassword"
										name="newPassword"
										type="password"
										value={passwordData.newPassword}
										onChange={handlePasswordInputChange}
										placeholder="Enter your new password"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="confirmPassword"
										className="text-xs sm:text-sm"
									>
										<span className="flex items-center gap-2">
											<Lock className="h-3 w-3 sm:h-4 sm:w-4" />
											Confirm New Password
										</span>
									</Label>
									<Input
										id="confirmPassword"
										name="confirmPassword"
										type="password"
										value={passwordData.confirmPassword}
										onChange={handlePasswordInputChange}
										placeholder="Confirm your new password"
										required
									/>
								</div>

								<div className="flex justify-end pt-4">
									<Button
										type="submit"
										disabled={isLoadingPassword}
										className="flex items-center gap-2"
									>
										<Lock className="h-4 w-4" />
										{isLoadingPassword ? 'Changing...' : 'Change Password'}
									</Button>
								</div>
							</form>
						)}
					</CardContent>
				</Card>

				<Card id="account-information">
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
		</div>
	);
};
