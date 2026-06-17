import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { authApi, AuthUser, RegisterPayload } from '../api/authApi';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Globalny stan uwierzytelnienia (Context API). Przechowuje zalogowanego
 * użytkownika i synchronizuje go z localStorage przez warstwę authApi.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authApi.getSession());

  const login = useCallback(async (email: string, password: string) => {
    const session = await authApi.login(email, password);
    setUser(session);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const session = await authApi.register(payload);
    setUser(session);
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!user) throw new Error('Brak zalogowanego użytkownika.');
      await authApi.changePassword(user.email, currentPassword, newPassword);
    },
    [user]
  );

  const deleteAccount = useCallback(async () => {
    if (!user) return;
    await authApi.deleteAccount(user.email);
    setUser(null);
  }, [user]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, changePassword, deleteAccount, logout }),
    [user, login, register, changePassword, deleteAccount, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth musi być użyty wewnątrz AuthProvider');
  return ctx;
}
