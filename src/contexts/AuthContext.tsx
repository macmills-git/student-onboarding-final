import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mockUsers } from '../lib/mockData';

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

// Mock authentication credentials (in a real app, this would be handled by the backend)
const mockCredentials = [
  { username: 'admin', password: 'admin123' },
  { username: 'clerk', password: 'clerk123' }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('auth_user');
    const savedProfile = localStorage.getItem('auth_profile');

    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser));
      setProfile(JSON.parse(savedProfile));
    }

    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    // Check credentials
    const validCredential = mockCredentials.find(c => c.username === username && c.password === password);
    if (!validCredential) {
      throw new Error('Invalid username or password');
    }

    // Find user in centralized mock data
    const mockUser = mockUsers.find(u => u.username === username);
    if (!mockUser || !mockUser.is_active) {
      throw new Error('User not found or inactive');
    }

    const user: User = {
      id: mockUser.id,
      email: `${mockUser.username}@system.local`
    };

    const profile: UserProfile = {
      id: mockUser.id,
      username: mockUser.username,
      full_name: mockUser.full_name,
      role: mockUser.role,
      permissions: mockUser.permissions,
      is_active: mockUser.is_active
    };

    // Save to localStorage for persistence
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_profile', JSON.stringify(profile));

    setUser(user);
    setProfile(profile);
  };

  const signOut = async () => {
    // Clear localStorage
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_profile');

    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
