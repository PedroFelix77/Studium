import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Roles = {
  admin: "Administrados",
  professor: "Professor",
  aluno: "Aluno",
} as const;

export type UserRole = keyof typeof Roles | null

interface User {
  id?: number;
  name?: string;
  email?: string;
  matricula?: string;
  role: Exclude<UserRole, null>;
}

interface AuthData {
  token: string;
  refresh?: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, role: Exclude<UserRole, null>) => Promise<void>;
  logout: () => void;
}
const AUTH_KEY = "auth";

const authStorage = {
  get: (): AuthData | null => {
    try{
      return JSON.parse(localStorage.getItem(AUTH_KEY) || "null")
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  },
  set: (data: AuthData) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  },
  clear: () => {
    localStorage.removeItem(AUTH_KEY)
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = authStorage.get();
     if(saved?.user) {
      setUser(saved.user)
     }
     setIsLoading(false);    
  }, []);

  const login = async (identifier: string, password: string, role: Exclude<UserRole, null>) => {
    try {
      const endpoint = 
      role === "aluno" ? "/api/login/aluno" : "/api/aluno"
      
      const payload = 
      role === "aluno"
      ? {matricula: identifier, password}
      : {email : identifier, password}

      const {data} = await axios.post(endpoint, payload)

      const authData: AuthData = data;
      authStorage.set(authData);
      setUser(authData.user);
      navigate(`/${authData.user.role}`);
    } catch (error) {
      console.error("Erro ao autenticar:", error)
      alert("Credenciais inválidas. Verifique seus dados e tente novamente")
    }
  }
  ;

  const logout = () => {
    authStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const userRole: UserRole = user?.role ?? null;
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  return (
    <AuthContext.Provider value={{ user, userRole, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
