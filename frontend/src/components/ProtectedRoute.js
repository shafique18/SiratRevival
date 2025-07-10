import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const roleHomeMap = {
  ADMIN: "/admin/homeadmin",
  GROUP_0_5: "/kids/homekid",
  GROUP_6_15: "/teen/hometeen",
  GROUP_16_25: "/young/homeyoung",
  GROUP_26_PLUS: "/adult/homeadult",
};

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.user_role)) {
    const redirectPath = roleHomeMap[user?.user_role] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

