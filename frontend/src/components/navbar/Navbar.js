import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import AuthContext from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../utils/LanguageSwitcher";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import DarkModeToggle from "./DarkModeToggle";
import AuthButtons from "./AuthButtons";
import logo from "../../static/images/ihdinas.jpg";
import menuData from "../../static/data/menuData";

export default function Navbar() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const navRef = useRef(null);

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

  const role = isAuthenticated ? user?.user_role || "member" : "GUEST";
  const menus = menuData[role] || menuData["GUEST"];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg z-[1000] border-b border-gray-200 dark:border-gray-800"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Sirat Revival Home">
          <img src={logo} alt="Sirat Revival Logo" className="h-10 w-auto rounded-md" />
          <span className="text-xl font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
            SIRAT REVIVAL
          </span>
        </Link>

        {/* Desktop Menu */}
        <DesktopMenu
          menus={menus}
          activeMegaMenu={activeMegaMenu}
          setActiveMegaMenu={setActiveMegaMenu}
        />

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-700 bg-gray-900 text-white"
          >
            <MobileMenu
              menus={menus}
              setMobileMenuOpen={setMobileMenuOpen}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              isAuthenticated={isAuthenticated}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
