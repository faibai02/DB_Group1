import React, { createContext, useContext, useState, useEffect } from 'react';
import { getJSON } from '../api/http';

interface User {
  email: string;
  name: string;
  customerId?: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getJSON<{
          authenticated: boolean;
          name?: string;
          email?: string;
          customerId?: number;
        }>('auth/check');
        
        if (response.authenticated && response.email && response.name) {
          setIsLoggedIn(true);
          const userData = { 
            email: response.email, 
            name: response.name,
            customerId: response.customerId 
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await getJSON('logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
