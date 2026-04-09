import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  subscribeToAuth,
  registerUser,
  loginUser,
  logoutUser,
} from '@/services/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    await loginUser(email, password);
  }

  async function register(email: string, password: string) {
    await registerUser(email, password);
  }

  async function logout() {
    await logoutUser();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
