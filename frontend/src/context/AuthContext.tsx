import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // TODO: Replace with actual authentication logic
    setIsAuthenticated(true);
  };

  const signup = () => {
    // TODO: Replace with actual authentication logic
    setIsAuthenticated(true);
  };

  const logout = () => {
    // TODO: Call logout API endpoint to clear auth tokens/session when auth is implemented
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
