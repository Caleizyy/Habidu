import { createContext, useContext, useState, ReactNode } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { authApi } from '../api/auth';
import { User, AuthContextType } from '../types/index';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // TODO: Replace with actual authentication logic
    setIsAuthenticated(true);
  };

  const signup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await authApi.loginWithGoogle(tokenResponse.code);
      await refreshUser();
      setIsAuthenticated(true);
    },
    onError: () => {
      console.log('Login Failed');
    },
    flow: 'auth-code',
    redirect_uri: 'http://localhost:5173',
  });

  const logout = () => {
    // TODO: Call logout API endpoint to clear auth tokens/session when auth is implemented
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.sessionCheck();
      setUser(response);
    } catch (error) {
      setUser(null);
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, refreshUser, login, signup, logout }}>
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
