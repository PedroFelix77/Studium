import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export const Roles = {
  admin: "Administrados",
  professor: "Professor",
  aluno: "Aluno",
} as const;

export type UserRole = keyof typeof Roles | null

interface AuthContextType {
  userRole: UserRole;
  login: (role: Exclude<UserRole, null>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
const AUTH_KEY = "auth";

const authStorage = {
  get: (): { role?: UserRole } | null => {
    try{
      return JSON.parse(localStorage.getItem(AUTH_KEY) || "null")
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  },
  set: (data: unknown) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  },
  clear: () => {
    localStorage.removeItem(AUTH_KEY)
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = authStorage.get();
     if(saved?.role) {
      setUserRole(saved.role)
     }
     setIsLoading(false);    
  }, []);

  const login = (role: UserRole) => {
    // TODO-API: login real
    // - Chamar POST /login com credenciais
    // - Receber tokens (access/refresh) e possivelmente dados do usuário (role)
    // - Salvar tokens no storage (ex.: localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens)))
    // - Se a API não retornar o papel, chamar GET /me para buscá-lo
    // - Atualizar userRole com o valor vindo da API
    if (!role) return;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ role }));
    setUserRole(role);
    navigate(`/${role}`);
  };

  const logout = () => {
    authStorage.clear();
    setUserRole(null);
    navigate("/login");
  };

  const isAuthenticated = useMemo(() => Boolean(userRole), [userRole]);

  return (
    <AuthContext.Provider value={{ userRole, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
