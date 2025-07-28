import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from "../../context/AuthContext";
import LanguageSwitcher from "../utils/LanguageSwitcher";
import logo from "../../static/images/ihdinas.jpg";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import menuData from "../../static/data/menuData";

export default function NavBar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMegaMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (title) => {
    clearTimeout(timeoutRef.current);
    setActiveMegaMenu(title);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMegaMenu(null), 200);
  };

  const handleKeyDown = (e, item) => {
    if (!item.columns) return;
    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      setActiveMegaMenu(item.title);
    }
    if (e.key === "Escape") {
      setActiveMegaMenu(null);
    }
  };

  const toggleDarkMode = () => setDarkMode((d) => !d);
  const toggleMobileMenu = () => setMobileMenuOpen((o) => !o);

  // Get role and menu data
  const role = isAuthenticated ? user?.user_role || "member" : "GUEST";
  const menus = menuData[role] || menuData["GUEST"];

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg z-50 border-b border-gray-200 dark:border-gray-800"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          {/* Left: Logo + Title */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="Sirat Revival Home"
          >
            <img
              src={logo}
              alt="Sirat Revival Logo"
              className="h-10 w-auto rounded-md"
            />
            <span className="text-xl font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
              SIRAT REVIVAL
            </span>
          </Link>

          {/* Right: Desktop Menu */}
          <ul
            className="hidden md:flex items-center gap-2 flex-grow justify-end"
            role="menubar"
          >
            {menus.map((item) => (
              <li
                key={item.title}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
                role="none"
              >
                {item.path ? (
                  <Link
                    to={item.path}
                    className="text-gray-800 dark:text-gray-200 font-semibold hover:text-green-500 transition px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    role="menuitem"
                  >
                    {t(item.title)}
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={activeMegaMenu === item.title}
                    aria-controls={`${item.title}-menu`}
                    onClick={() =>
                      setActiveMegaMenu((prev) =>
                        prev === item.title ? null : item.title
                      )
                    }
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    className="flex items-center gap-1 text-gray-800 dark:text-gray-200 font-semibold hover:text-green-500 transition px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    {t(item.title)}
                    <svg
                      className="w-3 h-3 mt-1 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                )}

                {/* Full-width Mega Menu Panel */}
                <AnimatePresence>
                  {activeMegaMenu === item.title && item.columns && (
                    <motion.div
                      key={`${item.title}-menu`}
                      id={`${item.title}-menu`}
                      role="menu"
                      aria-label={`${t(item.title)} submenu`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.25 }}
                      className="fixed top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-green-500 shadow-lg z-40"
                      onMouseEnter={() => handleMouseEnter(item.title)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-gray-700 dark:text-gray-300">
                        {item.columns.map((col, idx) => (
                          <div key={idx}>
                            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-5">
                              {t(col.heading)}
                            </h3>
                            <ul className="space-y-3" role="none">
                              {col.links.map((link) => (
                                <li key={link.name} role="none">
                                  <Link
                                    to={link.path}
                                    className="flex items-center gap-2 hover:text-green-500 transition font-medium"
                                    onClick={() => setActiveMegaMenu(null)}
                                    role="menuitem"
                                  >
                                    {link.icon && (
                                      <span className="text-green-500">
                                        {link.icon}
                                      </span>
                                    )}
                                    {t(link.name)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}

            {/* Language Switcher */}
            <li role="none" className="ml-4">
              <LanguageSwitcher />
            </li>

            {/* Dark Mode Toggle */}
            <li role="none" className="ml-4">
              <button
                onClick={toggleDarkMode}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className="p-2 rounded-md hover:bg-green-100 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
              </button>
            </li>

            {/* Auth Buttons */}
            <li role="none" className="ml-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="text-green-600 dark:text-green-400 font-semibold hover:underline"
                  >
                    {user?.username || t("Profile")}
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                  >
                    {t("Logout")}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
                >
                  {t("Login")}
                </Link>
              )}
            </li>
          </ul>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gray-800 text-white border-t border-gray-700"
            >
              <ul className="px-6 py-4 space-y-3">
                {menus.map((item) =>
                  item.columns ? (
                    <MobileMegaMenuItem
                      key={item.title}
                      item={item}
                      setMobileMenuOpen={setMobileMenuOpen}
                      t={t}
                    />
                  ) : (
                    <li key={item.title}>
                      <Link
                        to={item.path}
                        className="block py-2 px-3 rounded hover:bg-green-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(item.title)}
                      </Link>
                    </li>
                  )
                )}

                <li className="pt-4 border-t border-gray-700">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-4">
                      <Link
                        to="/profile"
                        className="text-green-400 font-semibold hover:text-green-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {user?.username || t("Profile")}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white rounded py-2"
                      >
                        {t("Logout")}
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="bg-green-600 hover:bg-green-700 text-white rounded py-2 px-6 text-center font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("Login")}
                    </Link>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

function MobileMegaMenuItem({ item, setMobileMenuOpen, t }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="w-full flex justify-between items-center text-white font-semibold text-lg hover:text-green-400 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${item.title}-mobile-submenu`}
      >
        {t(item.title)}
        <svg
          className={`w-5 h-5 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          } text-green-400`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          id={`${item.title}-mobile-submenu`}
          className="pl-4 mt-2 border-l border-green-400"
        >
          {item.columns.map((col, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="text-green-400 font-semibold mb-1">
                {t(col.heading)}
              </h4>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="block text-white hover:text-green-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t(link.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
