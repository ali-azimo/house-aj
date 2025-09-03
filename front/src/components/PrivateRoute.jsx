import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Debug: Verifique a estrutura do currentUser
  console.log("Current User in PrivateRoute:", currentUser);

  if (!currentUser) {
    // Usuário não autenticado - redirecionar para login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Se allowedRoles foi especificado, verificar se o usuário tem permissão
  if (allowedRoles && allowedRoles.length > 0) {
    // Extrair o role do usuário (pode estar em diferentes níveis do objeto)
    const userRole = currentUser.role || 
                    (currentUser.user && currentUser.user.role) || 
                    (currentUser.data && currentUser.data.role) || 
                    "user";
    
    console.log("User role:", userRole, "Allowed roles:", allowedRoles);
    
    if (!allowedRoles.includes(userRole)) {
      // Usuário não tem permissão - redirecionar para home
      return <Navigate to="/" replace />;
    }
  }

  // Usuário autenticado e com permissão
  return children ? children : <Outlet />;
}