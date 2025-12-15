import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// Frontend-only authentication - no API imports needed

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
      // Mock authentication for demo purposes (no backend required)
      const mockUsers = [
        {
          id: '1',
          username: 'mcmills',
          password: 'mcmills1',
          full_name: 'McMills User',
          role: 'admin' as const
        },
        {
          id: '2',
          username: 'admin',
          password: 'Admin123!',
          full_name: 'System Administrator',
          role: 'admin' as const
        },
        {
          id: '3',
          username: 'clerk',
          password: 'Clerk123!',
          full_name: 'System Clerk',
          role: 'clerk' as const
        }
      ];

      // Find matching user
      const mockUser = mockUsers.find(
        u => u.username === username && u.password === password
      );

      if (!mockUser) {
        throw new Error('Invalid username or password');
      }

      // Create mock token
      const mockToken = `mock-jwt-token-${Date.now()}`;

      // Store mock token
      localStorage.setItem('token', mockToken);
      localStorage.setItem('refreshToken', `refresh-${mockToken}`);

      const user: User = {
        id: mockUser.id,
        email: `${mockUser.username}@system.local`
      };

      const profile: UserProfile = {
        id: mockUser.id,
        username: mockUser.username,
        full_name: mockUser.full_name,
        role: mockUser.role,
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