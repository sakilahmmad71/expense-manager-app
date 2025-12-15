import { User, authAPI } from '@/lib/services';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	updateUser: (user: User) => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check for existing token on mount
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');

		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
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
	};

	const register = async (name: string, email: string, password: string) => {
		const response = await authAPI.register({ name, email, password });
		const { user, token } = response.data;

		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));

		setToken(token);
		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setToken(null);
		setUser(null);
	};

	const updateUser = (updatedUser: User) => {
		setUser(updatedUser);
		localStorage.setItem('user', JSON.stringify(updatedUser));
	};

	return (
		<AuthContext.Provider
			value={{ user, token, login, register, logout, updateUser, isLoading }}
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
