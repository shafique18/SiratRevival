// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import axios from "axios";

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
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    if (!email || !password || loading) return null;
    setLoading(true);

    try {
      // Create form-urlencoded body
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(`${baseURL}/auth/token`, formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        setAuthTokens(response.data);
        localStorage.setItem("authTokens", JSON.stringify(response.data));

        const profileRes = await axios.get(`${baseURL}/auth/me`, {
          headers: { Authorization: `Bearer ${response.data.access}` },
        });

        if (profileRes.status === 200) {
          setUser(profileRes.data);
          return profileRes.data;  // return profile here!
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
    return null;
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
        const decoded = jwtDecode(response.data.access);
        setUser(decoded);
        localStorage.setItem("authTokens", JSON.stringify(response.data));
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading && authTokens) {
      updateToken();
    } else if (!authTokens) {
      setLoading(false); // <-- allows public routes like Home to load
    }

    const interval = setInterval(() => {
      if (authTokens) {
        const decoded = jwtDecode(authTokens.access);
        const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 30000;

        if (isExpired) updateToken();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authTokens,
        login,
        logout,
        isAuthenticated: !!user,
        ageGroup: user?.age_group || null,
        axiosInstance,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
