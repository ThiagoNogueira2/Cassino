import React, { createContext, useContext, useState, useCallback } from "react";
import { mockUser, type User } from "@/mock/data";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  authModal: "login" | "register" | "forgot" | null;
  openAuth: (modal: "login" | "register" | "forgot") => void;
  closeAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<"login" | "register" | "forgot" | null>(null);

  const openAuth = useCallback((modal: "login" | "register" | "forgot") => {
    setAuthModal(modal);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthModal(null);
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simulated login
    await new Promise((r) => setTimeout(r, 1000));
    if (email) {
      setUser({ ...mockUser, email });
      setAuthModal(null);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1000));
    setUser({
      ...mockUser,
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      balance: 0,
    });
    setAuthModal(null);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, authModal, openAuth, closeAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
