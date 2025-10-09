import { Navigate, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { userRole, isLoading } = useAuth();

  // TODO-API: enquanto restoreSession valida tokens ou chama /me,
  // exiba um fallback de carregamento (spinner/skeleton) no lugar de null.
  // Quando integrar, substitua por algo como: return <FullPageSpinner />
  if (isLoading) return null;
  if (!userRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/login" replace />;

  return children ? <>{children}</> : <Outlet />;
}