import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GlobalLoadingBar } from '@/components/GlobalLoadingBar';
import { CommandPalette } from '@/components/ui/command-palette';
import { usePrefetchOnHover, usePrefetchData } from '@/hooks/usePrefetch';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	LayoutDashboard,
	Receipt,
	LogOut,
	Tag,
	Wallet,
	User,
	ChevronDown,
	Github,
	Linkedin,
	Facebook,
	Heart,
	Code,
} from 'lucide-react';

export const Layout = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [commandOpen, setCommandOpen] = useState(false);
	const { prefetchDashboard, prefetchExpenses, prefetchCategories } =
		usePrefetchOnHover();

	// Monitor network status
	useNetworkStatus();

	// Prefetch data in the background for better performance
	usePrefetchData();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const isActive = (path: string) => location.pathname === path;

	const navItems = [
		{
			path: '/dashboard',
			icon: LayoutDashboard,
			label: 'Dashboard',
			prefetch: prefetchDashboard,
		},
		{
			path: '/expenses',
			icon: Receipt,
			label: 'Expenses',
			prefetch: prefetchExpenses,
		},
		{
			path: '/categories',
			icon: Tag,
			label: 'Categories',
			prefetch: prefetchCategories,
		},
		{
			path: '/profile',
			icon: User,
			label: 'Profile',
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Global Loading Bar */}
			<GlobalLoadingBar />
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<Link
							to="/dashboard"
							className="flex items-center gap-3 group transition-all duration-200"
						>
							<div className="h-10 w-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
								<Wallet className="h-6 w-6 text-white" />
							</div>
							<div className="hidden sm:block">
								<h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
									Expenser
								</h1>
							</div>
						</Link>
						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center gap-2">
							{navItems
								.filter(item => item.path !== '/profile')
								.map(item => (
									<Link
										key={item.path}
										to={item.path}
										onMouseEnter={() => item.prefetch?.()}
									>
										<Button
											variant={isActive(item.path) ? 'default' : 'ghost'}
											className={`flex items-center gap-2 transition-all duration-200 ${
												isActive(item.path)
													? 'bg-gray-900 text-white shadow-md hover:bg-gray-800'
													: 'hover:bg-gray-100'
											}`}
										>
											<item.icon className="h-4 w-4" />
											<span className="font-medium">{item.label}</span>
										</Button>
									</Link>
								))}{' '}
						</nav>{' '}
						{/* Desktop User Menu */}
						<div className="hidden md:flex items-center gap-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="flex items-center gap-3 hover:bg-gray-100 transition-colors px-3 py-2 rounded-lg"
									>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage src="" alt={user?.name || 'User'} />
												<AvatarFallback className="bg-gradient-to-br from-gray-900 to-gray-800 text-white text-sm">
													{user?.name?.charAt(0).toUpperCase() || 'U'}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm font-medium text-gray-900">
												{user?.name}
											</span>
										</div>
										<ChevronDown className="h-4 w-4 text-gray-500" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-64">
									<div className="px-3 py-3 border-b">
										<div className="flex items-center gap-3">
											<Avatar className="h-10 w-10">
												<AvatarImage src="" alt={user?.name || 'User'} />
												<AvatarFallback className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
													{user?.name?.charAt(0).toUpperCase() || 'U'}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-semibold text-gray-900 truncate">
													{user?.name}
												</p>
												<p className="text-xs text-gray-500 truncate">
													{user?.email}
												</p>
											</div>
										</div>
									</div>

									<div className="py-1">
										<DropdownMenuItem
											onClick={() => navigate('/profile')}
											className="cursor-pointer px-3 py-2.5 hover:bg-gray-50"
										>
											<User className="mr-3 h-4 w-4 text-gray-500" />
											<div className="flex flex-col">
												<span className="text-sm font-medium">
													Profile Settings
												</span>
												<span className="text-xs text-gray-500">
													Manage your account
												</span>
											</div>
										</DropdownMenuItem>
									</div>

									<DropdownMenuSeparator />

									<div className="py-1">
										<DropdownMenuItem
											onClick={handleLogout}
											className="cursor-pointer px-3 py-2.5 hover:bg-red-50 text-red-600 focus:text-red-600"
										>
											<LogOut className="mr-3 h-4 w-4" />
											<span className="text-sm font-medium">Sign out</span>
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						{/* Mobile User Menu */}
						<div className="md:hidden flex items-center">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="flex items-center gap-1.5 hover:bg-gray-100 rounded-full p-1.5"
									>
										<Avatar className="h-8 w-8">
											<AvatarImage src="" alt={user?.name || 'User'} />
											<AvatarFallback className="bg-gradient-to-br from-gray-900 to-gray-800 text-white text-sm">
												{user?.name?.charAt(0).toUpperCase() || 'U'}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-72">
									<div className="px-3 py-3 border-b">
										<div className="flex items-center gap-3">
											<Avatar className="h-12 w-12">
												<AvatarImage src="" alt={user?.name || 'User'} />
												<AvatarFallback className="bg-gradient-to-br from-gray-900 to-gray-800 text-white text-lg">
													{user?.name?.charAt(0).toUpperCase() || 'U'}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-semibold text-gray-900 truncate">
													{user?.name}
												</p>
												<p className="text-xs text-gray-500 truncate">
													{user?.email}
												</p>
											</div>
										</div>
									</div>

									<div className="py-1">
										<DropdownMenuItem
											onClick={() => navigate('/profile')}
											className="cursor-pointer px-3 py-3 hover:bg-gray-50"
										>
											<User className="mr-3 h-5 w-5 text-gray-500" />
											<div className="flex flex-col">
												<span className="text-sm font-medium">
													Profile Settings
												</span>
												<span className="text-xs text-gray-500">
													Manage your account
												</span>
											</div>
										</DropdownMenuItem>
									</div>

									<DropdownMenuSeparator />

									<div className="py-1">
										<DropdownMenuItem
											onClick={handleLogout}
											className="cursor-pointer px-3 py-3 hover:bg-red-50 text-red-600 focus:text-red-600"
										>
											<LogOut className="mr-3 h-5 w-5" />
											<span className="text-sm font-medium">Sign out</span>
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</header>
			{/* Main Content */}
			<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
				<Outlet />
			</main>
			{/* Footer - Hidden on mobile (bottom nav takes precedence) */}
			<footer className="hidden md:block bg-white border-t border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col items-center justify-center space-y-6">
						{/* Page Links */}
						<div className="flex items-center gap-6 text-sm">
							<Link
								to="/privacy"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Privacy Policy
							</Link>
							<span className="text-gray-300">•</span>
							<Link
								to="/terms"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Terms & Conditions
							</Link>
							<span className="text-gray-300">•</span>
							<Link
								to="/security"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Security
							</Link>
						</div>

						{/* Divider */}
						<div className="w-full max-w-md border-t border-gray-200"></div>

						{/* Social Links */}
						<div className="flex items-center gap-6">
							<a
								href="https://github.com/sakilahmmad71"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
							>
								<Github className="h-5 w-5" />
								<span className="text-sm font-medium">GitHub</span>
							</a>
							<a
								href="https://linkedin.com/in/sakilahmmad71"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
							>
								<Linkedin className="h-5 w-5" />
								<span className="text-sm font-medium">LinkedIn</span>
							</a>
							<a
								href="https://facebook.com/sakilahmmad71"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
							>
								<Facebook className="h-5 w-5" />
								<span className="text-sm font-medium">Facebook</span>
							</a>
						</div>

						{/* Divider */}
						<div className="w-full max-w-md border-t border-gray-200"></div>

						{/* Copyright */}
						<div className="flex flex-col items-center gap-2 text-center">
							<p className="text-sm text-gray-600 flex items-center gap-1">
								Made with{' '}
								<Heart className="h-4 w-4 text-red-500 fill-red-500" /> by{' '}
								<a
									href="https://github.com/sakilahmmad71"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold text-gray-900 hover:underline"
								>
									Shakil Ahmed
								</a>
							</p>
							<p className="text-xs text-gray-500 flex items-center gap-1">
								<Code className="h-3 w-3" />
								Open source and free for everyone to use
							</p>
							<p className="text-xs text-gray-400">
								© {new Date().getFullYear()} Expenser. All rights reserved.
							</p>
						</div>
					</div>
				</div>
			</footer>
			{/* Mobile Bottom Navigation */}
			<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 z-50 shadow-2xl">
				<div className="safe-area-inset-bottom">
					<div className="grid grid-cols-4 gap-1 px-1.5 py-1">
						{navItems.map(item => (
							<Link key={item.path} to={item.path}>
								<button
									className={`relative w-full flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-300 ${
										isActive(item.path)
											? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg scale-105'
											: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-95'
									}`}
								>
									{/* Active indicator dot */}
									{isActive(item.path) && (
										<div className="absolute -top-0.5 w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
									)}
									<item.icon
										className={`h-[18px] w-[18px] mb-0.5 transition-all duration-300 ${
											isActive(item.path) ? 'scale-110' : ''
										}`}
									/>
									<span
										className={`text-[9px] font-semibold tracking-wide ${
											isActive(item.path) ? 'opacity-100' : 'opacity-70'
										}`}
									>
										{item.label}
									</span>
								</button>
							</Link>
						))}
					</div>
				</div>
			</nav>
			{/* Command Palette */}
			<CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
		</div>
	);
};
