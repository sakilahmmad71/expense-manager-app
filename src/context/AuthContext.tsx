import { User, authAPI } from '@/lib/services';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	updateUser: (user: User) => void;
	setToken: (token: string) => void;
	setUser: (user: User) => void;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const queryClient = useQueryClient();

	useEffect(() => {
		// Check for existing token on mount
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');

		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		const response = await authAPI.login({ email, password });
		const { user, token } = response.data;

		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));

		setToken(token);
		setUser(user);
		setIsAuthenticated(true);
	};

	const register = async (name: string, email: string, password: string) => {
		const response = await authAPI.register({ name, email, password });
		const { user, token } = response.data;

		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));

		setToken(token);
		setUser(user);
		setIsAuthenticated(true);
	};

	const logout = () => {
		// Clear all React Query cache on logout to prevent data leaks
		queryClient.clear();

		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setToken(null);
		setUser(null);
		setIsAuthenticated(false);
	};

	const updateUser = (updatedUser: User) => {
		setUser(updatedUser);
		localStorage.setItem('user', JSON.stringify(updatedUser));
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				isAuthenticated,
				login,
				register,
				logout,
				updateUser,
				setToken,
				setUser,
				setIsAuthenticated,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
