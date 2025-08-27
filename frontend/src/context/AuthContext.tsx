import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginDto, UserDto } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: UserDto) => Promise<void>;
  logout: () => void;
  updateProfile: (userId: number, userData: Partial<UserDto>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      // You could validate the token here
      // For now, we'll just check if it exists
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      const response = await authAPI.login(credentials);
      const { userId, username, role } = response.data;
      
      // Store user info in localStorage
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      
      // Create a user object
      const user: User = {
        id: userId,
        username,
        role,
        email: '', // You might want to get this from the response
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: UserDto) => {
    try {
      const response = await authAPI.register(userData);
      // After successful registration, you might want to auto-login
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  const updateProfile = async (userId: number, userData: Partial<UserDto>) => {
    try {
      const response = await authAPI.updateProfile(userId, userData);
      // Update local user state if needed
      console.log('Profile updated:', response.data);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
