import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { authApi } from '../api/auth';
import { User, AuthContextType } from '../types/index';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  });

  const logout = async () => {
    // TODO: Call logout API endpoint to clear auth tokens/session when auth is implemented
    // await refreshUser();
    // setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.sessionCheck();
      setUser(response);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.log(error);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, refreshUser, signup, logout }}>
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
