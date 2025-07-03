import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../static/images/ihdinas.jpg";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, ageGroup, logout } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Check if user is admin by ageGroup or role
  const isAdmin =
    ageGroup === "ADMIN" ||
    user?.roles?.some((role) => role.name === "ADMIN");

  return (
    <nav className="bg-white dark:bg-gray-800 shadow transition-colors duration-300 fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white rounded">
          <img
            src={logo}
            alt="SiratRevival Logo"
            className="h-16 w-24 object-contain"
          />
        </div>
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
          >
            {t("Home")}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
              >
                {t("Profile")}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  {t("AdminDashboard")}
                </Link>
              )}

              <button
                onClick={logout}
                className="text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
              >
                {t("Logout")}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
            >
              {t("Login")}
            </Link>
          )}

          <LanguageSwitcher />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded focus:outline-none transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
