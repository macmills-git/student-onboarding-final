import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, setTokens, clearTokens, getToken } from '../services/api';

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
  isAuthenticated: boolean;
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
    // Check for existing session and validate token
    const initAuth = async () => {
      const token = getToken();
      
      if (token) {
        try {
          // Verify token is valid by fetching profile
          const userProfile = await authAPI.getProfile();
          
          const user: User = {
            id: userProfile.id,
            email: `${userProfile.username}@system.local`
          };

          const profile: UserProfile = {
            id: userProfile.id,
            username: userProfile.username,
            full_name: userProfile.full_name,
            role: userProfile.role.toLowerCase() as 'admin' | 'clerk',
            permissions: userProfile.permissions,
            is_active: userProfile.is_active
          };

          setUser(user);
          setProfile(profile);
        } catch (error) {
          // Token invalid, clear it
          console.error('Token validation failed:', error);
          clearTokens();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // Call real API
      const response = await authAPI.login(username, password);
      
      // Store tokens
      setTokens(response.access_token, response.refresh_token);

      // Fetch user profile
      const userProfile = await authAPI.getProfile();

      const user: User = {
        id: userProfile.id,
        email: `${userProfile.username}@system.local`
      };

      const profile: UserProfile = {
        id: userProfile.id,
        username: userProfile.username,
        full_name: userProfile.full_name,
        role: userProfile.role.toLowerCase() as 'admin' | 'clerk',
        permissions: userProfile.permissions,
        is_active: userProfile.is_active
      };

      setUser(user);
      setProfile(profile);
      
      console.log('Profile loaded after login:', profile);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const signOut = async () => {
    try {
      // Call API to invalidate token
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear tokens and state
      clearTokens();
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthenticated: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};