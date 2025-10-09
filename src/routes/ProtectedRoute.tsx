import { Navigate} from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    roles: "admin" | "professor" | "aluno";
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
    // Aqui futuramente buscar do contexto/auth o usuário logado
    const user ={
        isAuthenticated: true, // futuramente vem do backend
        role: "admin", //trocar dinamicamente depois
    }

    if(!user.isAuthenticated) return <Navigate to="/login" replace/>;
    
    if(user.role !== roles) return <Navigate to="/unauthorized" replace/>;

    return children;
}