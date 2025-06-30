import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import dayjs from "dayjs";
import axios from "axios";

const AuthContext = createContext();

const baseURL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await axios.post(`${baseURL}/auth/token`, {
      username: email,
      password,
    });

    if (response.status === 200) {
      setAuthTokens(response.data);
      setUser(jwt_decode(response.data.access));
      localStorage.setItem("authTokens", JSON.stringify(response.data));
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  const updateToken = async () => {
    if (!authTokens?.refresh) return logout();

    try {
      const response = await axios.post(`${baseURL}/auth/token/refresh`, {
        refresh: authTokens.refresh,
      });

      if (response.status === 200) {
        setAuthTokens(response.data);
        setUser(jwt_decode(response.data.access));
        localStorage.setItem("authTokens", JSON.stringify(response.data));
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    if (loading) updateToken();

    const interval = setInterval(() => {
      if (authTokens) {
        const decoded = jwt_decode(authTokens.access);
        const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 30000; // less than 30s

        if (isExpired) updateToken();
      }
    }, 60 * 1000); // every 1 min

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={{
      user,
      authTokens,
      login,
      logout,
      isAuthenticated: !!user,
      axiosInstance,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;