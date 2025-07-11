import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../static/images/ihdinas.jpg";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

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

  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.user_role || null;
  const isAdmin = role === "ADMIN";

  const roleDashboards = {
    ADMIN: "/admin/homeadmin",
    GROUP_0_5: "/kids/homekid",
    GROUP_6_15: "/teen/hometeen",
    GROUP_16_25: "/young/homeyoung",
    GROUP_26_PLUS: "/adult/homeadult",
  };

  const dashboardLink = roleDashboards[role];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow fixed top-0 w-full z-50 h-16">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between h-full">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src={logo}
              alt="SiratRevival Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-300">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            {t("Home")}
          </Link>

          {isAuthenticated ? (
            <>
              {dashboardLink && (
                <Link
                  to={dashboardLink}
                  className="hover:text-blue-600 transition-colors"
                >
                  {t("Dashboard")}
                </Link>
              )}
              <Link
                to="/profile"
                className="hover:text-blue-600 transition-colors"
              >
                {t("Profile")}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hover:text-blue-600 transition-colors"
                >
                  {t("AdminDashboard")}
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
              >
                {t("Logout")}
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-600 transition-colors">
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

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-7 h-7 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md px-4 pb-4 space-y-3 text-gray-700 dark:text-gray-300">
          <Link
            to="/"
            className="block hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            {t("Home")}
          </Link>
          {isAuthenticated ? (
            <>
              {dashboardLink && (
                <Link
                  to={dashboardLink}
                  className="block hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("Dashboard")}
                </Link>
              )}
              <Link
                to="/profile"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                {t("Profile")}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("AdminDashboard")}
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block text-left hover:text-red-500 bg-transparent border-none cursor-pointer w-full"
              >
                {t("Logout")}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              {t("Login")}
            </Link>
          )}

          <LanguageSwitcher />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded w-full focus:outline-none mt-2"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
