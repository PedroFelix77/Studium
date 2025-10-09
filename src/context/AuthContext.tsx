import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type UserRole = "admin" | "professor" | "aluno" | null;

interface AuthContextType {
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const AUTH_KEY = "auth";
  // TODO-API: defina aqui as chaves/nomes que usará para guardar tokens
  // ex.: const TOKENS_KEY = "tokens"; const USER_KEY = "user";

  useEffect(() => {
    // TODO-API: restoreSession
    // 1) Ler tokens do storage (access/refresh)
    // 2) Se existirem, opcionalmente chamar GET /me para validar e obter o papel do usuário
    // 3) Se válido, atualizar userRole; se inválido, limpar storage
    // 4) Ao final, setar isLoading(false)
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { role?: UserRole };
        if (parsed?.role) {
          setUserRole(parsed.role);
        }
      } catch {
        // ignorar erros de análise e limpar armazenamento inválido
        localStorage.removeItem(AUTH_KEY);
      }
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
    // TODO-API: logout real
    // - Opcional: chamar POST /logout (ou revogar refresh token)
    // - Limpar tokens e quaisquer dados do usuário do storage
    localStorage.removeItem(AUTH_KEY);
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
