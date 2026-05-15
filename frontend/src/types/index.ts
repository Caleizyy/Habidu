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
  login: () => void;
  signup: () => void;
  logout: () => void;
}
export interface Oauth2Token {
  access_token: string;
  authuser?: string;
  expires_in: number;
  gis_params?: string;
  iss?: string;
  oauth_metadata?: string;
  prompt: string;
  scope: string;
  token_type: string;
}
