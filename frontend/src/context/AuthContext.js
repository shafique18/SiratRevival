// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();
export default AuthContext;

const baseURL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const stored = localStorage.getItem("authTokens");
    return stored ? JSON.parse(stored) : null;
  });

  const [user, setUser] = useState(() => {
    const storedProfile = localStorage.getItem("userProfile");
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(`${baseURL}/auth/token`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = response.data;

      if (!data.access_token || typeof data.access_token !== "string") {
        throw new Error("No valid access token returned");
      }

      setAuthTokens(data);
      localStorage.setItem("authTokens", JSON.stringify(data));

      const profile = await getUserProfile(data.access_token);
      if (profile) {
        setUser(profile);
        localStorage.setItem("userProfile", JSON.stringify(profile));
        return profile;
      }

      return null;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      logout();
      return null;
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("userProfile");
    return <Navigate to="/" />
  };

  const getUserProfile = async (accessToken) => {
    try {
      const res = await axios.get(`${baseURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken || authTokens?.access_token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Fetching user profile failed:", error);
      return null;
    }
  };

  const refreshTokenIfNeeded = () => {
    if (!authTokens) return;
    try {
      const decoded = jwtDecode(authTokens.access_token);
      const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 5000;
      if (!isExpired) return;

      axios
        .post(`${baseURL}/auth/refresh`, {
          refresh_token: authTokens.refresh_token,
        })
        .then((res) => {
          setAuthTokens(res.data);
          localStorage.setItem("authTokens", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.error("Token refresh failed:", err);
          logout();
        });
    } catch (err) {
      console.error("Refresh error:", err);
      logout();
    }
  };

  useEffect(() => {
    if (authTokens) {
      refreshTokenIfNeeded();
      getUserProfile(authTokens.access_token).then((profile) => {
        if (profile) {
          setUser(profile);
          localStorage.setItem("userProfile", JSON.stringify(profile));
        }
      });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        login,
        logout,
        loading,
        role: user?.user_role || null,
        isAuthenticated: !!authTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
