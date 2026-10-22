import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('academia_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('academia_token');
      if (savedToken) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('academia_token');
            setUser(null);
          }
        } catch (err) {
          // If token expired or network issue, fallback gracefully
          console.warn('Auth initialization fallback');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.token && res.user) {
        localStorage.setItem('academia_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
      throw new Error(res.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(userData);
      if (res.success && res.token && res.user) {
        localStorage.setItem('academia_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
      throw new Error(res.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('academia_token');
    setToken(null);
    setUser(null);
  };

  // Instant one-click switch between demo evaluation personas
  const switchDemoRole = async (role: UserRole) => {
    const credentials: Record<UserRole, { email: string; pass: string }> = {
      STUDENT: { email: 'ayush.student@academia.edu', pass: 'Student@123' },
      FACULTY: { email: 'prof.sharma@academia.edu', pass: 'Faculty@123' },
      ADMIN: { email: 'admin@academia.edu', pass: 'Admin@123' },
    };

    const target = credentials[role];
    await login(target.email, target.pass);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
