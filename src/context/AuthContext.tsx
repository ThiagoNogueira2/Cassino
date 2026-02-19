import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { mockUser, type User } from "@/mock/data";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  authModal: "login" | "register" | "forgot" | null;
  openAuth: (modal: "login" | "register" | "forgot") => void;
  closeAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

interface ApiUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  avatar: string | null;
  balance: number;
  level: string;
  joinedAt: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<"login" | "register" | "forgot" | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar usuário ao iniciar se houver token salvo
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me", true);
      if (response.user) {
        setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          cpf: response.user.cpf,
          avatar: response.user.avatar,
          balance: response.user.balance,
          level: response.user.level,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const openAuth = useCallback((modal: "login" | "register" | "forgot") => {
    setAuthModal(modal);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthModal(null);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      
      if (response.token) {
        localStorage.setItem("token", response.token);
        
        // Buscar dados do usuário após login
        if (response.user) {
          setUser({
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            cpf: response.user.cpf,
            avatar: response.user.avatar,
            balance: response.user.balance,
            level: response.user.level,
          });
        }
        
        setAuthModal(null);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        password: data.password,
      });
      
      if (response.token) {
        localStorage.setItem("token", response.token);
        
        // Buscar dados do usuário após registro
        if (response.user) {
          setUser({
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            cpf: response.user.cpf,
            avatar: response.user.avatar,
            balance: response.user.balance,
            level: response.user.level,
          });
        }
        
        setAuthModal(null);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Register error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, authModal, openAuth, closeAuth, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
