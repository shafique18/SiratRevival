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
  const [authTokens, setAuthTokens] = useState(() => {
    const stored = localStorage.getItem("authTokens");
    return stored ? JSON.parse(stored) : null;
  });

  // user will now hold the full profile data, not just JWT claims
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
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = response.data;
      console.log("Login response data:", data);

      if (!data.access_token || typeof data.access_token !== "string") {
        throw new Error("No valid access token returned");
      }

      setAuthTokens(data);
      localStorage.setItem("authTokens", JSON.stringify(data));

      // Fetch full user profile from backend
      const profile = await getUserProfile(data.access_token);
      console.log(profile);
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
  };

  const getUserProfile = async (accessToken) => {
    try {
      const res = await axios.get(`${baseURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken || authTokens?.access_token}`,
        },
      });
      return res.data; // Assuming backend returns full user profile object
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

      if (isExpired) {
        console.warn("Token expired. Logging out.");
        logout();
      }
    } catch (err) {
      console.error("Failed to decode token during refresh check:", err);
      logout();
    }
  };

  useEffect(() => {
    if (authTokens) {
      getUserProfile(authTokens.access_token).then((profile) => {
        if (profile) {
          setUser(profile);
          localStorage.setItem("userProfile", JSON.stringify(profile));
        } else {
          logout();
        }
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshTokenIfNeeded();
    }, 60000);

    return () => clearInterval(interval);
  }, [authTokens]);

  const isAuthenticated = !!authTokens && !!user;
  const ageGroup = user?.age_group || null;

  const contextData = {
    user,
    authTokens,
    isAuthenticated,
    ageGroup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
