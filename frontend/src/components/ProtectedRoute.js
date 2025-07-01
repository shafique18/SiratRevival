// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, ageGroup } = useContext(AuthContext);
  console.log("ProtectedRoute", { isAuthenticated, ageGroup, requiredRole });

  if (!isAuthenticated) {
    console.log("Not authenticated - redirect to login");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && ageGroup !== requiredRole) {
    console.log("Unauthorized access - redirect to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
export default ProtectedRoute;
