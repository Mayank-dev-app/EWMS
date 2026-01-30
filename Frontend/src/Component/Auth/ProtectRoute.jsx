import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/AuthContext";

export default function ProtectedRoute({ 
  redirectTo = "/login", 
  allowedRoles = [] 
}) {
  const { user } = useAuth();

  // 1. If not logged in → redirect
  if (!user) return <Navigate to={redirectTo} replace />;

  // 2. If role not allowed → redirect to unauthorized page (or home)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // 3. If both OK → allow route
  return <Outlet />;
}
