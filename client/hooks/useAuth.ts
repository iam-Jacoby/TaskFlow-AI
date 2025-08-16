import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  plan: string;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'Jacob Abraham',
  email: 'jacob@taskflow.ai',
  role: 'Product Manager',
  plan: 'Pro',
  joinDate: '2023-08-15'
};

// Valid login credentials
const VALID_CREDENTIALS = [
  { email: 'jacob@taskflow.ai', password: 'password123' },
  { email: 'admin@taskflow.ai', password: 'admin123' },
  { email: 'demo@taskflow.ai', password: 'demo123' }
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('taskflow_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check credentials
    const isValid = VALID_CREDENTIALS.some(
      cred => cred.email === email && cred.password === password
    );
    
    if (isValid) {
      const loggedInUser = { ...mockUser, email };
      setUser(loggedInUser);
      localStorage.setItem('taskflow_user', JSON.stringify(loggedInUser));
      setIsLoading(false);
      return { success: true };
    } else {
      setIsLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}