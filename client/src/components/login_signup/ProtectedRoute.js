import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { authState } = useAuth();
  const isAuthenticated = authState.isAuthenticated;
  const userRole = authState.role;

  return isAuthenticated && allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
