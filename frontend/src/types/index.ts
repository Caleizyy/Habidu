export interface User {
  sub: string;
  email: string;
  name: string;
  avatar?: string;
}
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  signup: () => void;
  logout: () => void;
}
