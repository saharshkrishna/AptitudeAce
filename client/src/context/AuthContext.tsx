import React, { createContext, useContext, ReactNode } from 'react';

interface User { id: string; name: string; email: string; }
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const GUEST_USER: User = { id: 'guest', name: 'Guest', email: 'guest@aptitudeace.app' };

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = GUEST_USER;
  const token = 'guest-token';

  const login = async (_email: string, _password: string) => {};
  const register = async (_name: string, _email: string, _password: string) => {};
  const logout = () => {};

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
