import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../lib/api';

interface User {
  id: string;
  email: string;
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  role: 'admin' | 'clerk';
  permissions: Record<string, any>;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('auth_user');
    const savedProfile = localStorage.getItem('auth_profile');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedProfile && savedToken) {
      setUser(JSON.parse(savedUser));
      setProfile(JSON.parse(savedProfile));
    }

    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // Use the real API for authentication
      const response = await authApi.login({ username, password });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }

      const { accessToken, refreshToken, user: apiUser } = response.data;

      // Store tokens
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const user: User = {
        id: apiUser.id,
        email: `${apiUser.username}@system.local`
      };

      const profile: UserProfile = {
        id: apiUser.id,
        username: apiUser.username,
        full_name: apiUser.full_name,
        role: apiUser.role,
        permissions: {},
        is_active: true
      };

      // Save to localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_profile', JSON.stringify(profile));

      setUser(user);
      setProfile(profile);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const signOut = async () => {
    try {
      // Call logout API
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage regardless of API call result
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_profile');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};