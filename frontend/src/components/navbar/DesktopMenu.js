// DesktopMenu.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MegaMenuPanel from "./MegaMenuPanel";
import LanguageSwitcher from "../utils/LanguageSwitcher";
import DarkModeToggle from "./DarkModeToggle";
import AuthButtons from "./AuthButtons";
import AuthContext from "../../context/AuthContext";

export default function DesktopMenu({ menus, activeMegaMenu, setActiveMegaMenu }) {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

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

  return (
    <div className="hidden md:flex items-center gap-2 relative flex-grow justify-end">
      {menus.map((item) => (
        <div
          key={item.title}
          className="relative"
          onMouseEnter={() => setActiveMegaMenu(item.title)}
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          {item.path ? (
            <Link
              to={item.path}
              className="text-gray-800 dark:text-gray-200 font-semibold hover:text-green-500 transition px-3 py-2 rounded-md"
            >
              {t(item.title)}
            </Link>
          ) : (
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={activeMegaMenu === item.title}
              onClick={() =>
                setActiveMegaMenu((prev) => (prev === item.title ? null : item.title))
              }
              onKeyDown={(e) => handleKeyDown(e, item)}
              className="flex items-center gap-1 text-gray-800 dark:text-gray-200 font-semibold hover:text-green-500 transition px-3 py-2 rounded-md"
            >
              {t(item.title)}
              <svg className="w-3 h-3 mt-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}

          {item.columns && (
            <MegaMenuPanel
              item={item}
              activeMegaMenu={activeMegaMenu}
              setActiveMegaMenu={setActiveMegaMenu}
            />
          )}
        </div>
      ))}

      <LanguageSwitcher />
      <DarkModeToggle />
      <AuthButtons isAuthenticated={isAuthenticated} user={user} logout={logout} />
    </div>
  );
}
