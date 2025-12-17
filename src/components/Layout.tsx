import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
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

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const isActive = (path: string) => location.pathname === path;

	const navItems = [
		{ path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
		{ path: '/expenses', icon: Receipt, label: 'Expenses' },
		{ path: '/categories', icon: Tag, label: 'Categories' },
	];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 bg-gray-900 rounded-lg flex items-center justify-center">
								<Wallet className="h-6 w-6 text-white" />
							</div>
							<h1 className="text-2xl font-bold text-gray-900">Expenser</h1>
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center space-x-4">
							{navItems.map(item => (
								<Link key={item.path} to={item.path}>
									<Button
										variant={isActive(item.path) ? 'default' : 'ghost'}
										className="flex items-center gap-2"
									>
										<item.icon className="h-4 w-4" />
										{item.label}
									</Button>
								</Link>
							))}
						</nav>

						{/* Desktop User Menu */}
						<div className="hidden md:flex items-center gap-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="flex items-center gap-2">
										<User className="h-4 w-4" />
										<span>{user?.name}</span>
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>My Account</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => navigate('/profile')}>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Logout</span>
									</DropdownMenuItem>
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
										className="flex items-center gap-1"
									>
										<User className="h-4 w-4" />
										<ChevronDown className="h-3 w-3" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => navigate('/profile')}>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Logout</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</header>{' '}
			{/* Main Content */}
			<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
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
			<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 shadow-lg">
				<div className="grid grid-cols-3 gap-0.5 px-1 py-1.5">
					{navItems.map(item => (
						<Link key={item.path} to={item.path}>
							<button
								className={`w-full flex flex-col items-center justify-center py-1.5 px-1 rounded-md transition-all duration-200 ${
									isActive(item.path)
										? 'bg-gray-900 text-white shadow-md'
										: 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
								}`}
							>
								<item.icon className="h-4 w-4 mb-0.5" />
								<span className="text-[10px] font-medium">{item.label}</span>
							</button>
						</Link>
					))}
				</div>
			</nav>
		</div>
	);
};
