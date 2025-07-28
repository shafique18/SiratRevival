import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../utils/LanguageSwitcher";
import DarkModeToggle from "./DarkModeToggle";
import AuthButtons from "./AuthButtons";

export default function MobileMenu({
  menus,
  setMobileMenuOpen,
  darkMode,
  setDarkMode,
  isAuthenticated,
}) {
  const { t } = useTranslation();

  return (
    <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-5 bg-white dark:bg-gray-900 space-y-6 rounded-lg shadow-lg">
      {/* Navigation Items */}
      <ul className="space-y-4">
        {menus.map((item) =>
          item.columns ? (
            <details
              key={item.title}
              className="group border border-green-500 rounded-lg bg-green-50 dark:bg-gray-800"
            >
              <summary className="cursor-pointer py-3 px-4 text-green-900 dark:text-green-300 font-semibold bg-green-100 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-gray-600 rounded-md">
                {t(item.title)}
              </summary>
              <div className="px-4 pb-4 pt-2 space-y-4">
                {item.columns.map((col, idx) => (
                  <div key={idx}>
                    {col.heading && (
                      <h4 className="text-green-700 dark:text-green-400 font-semibold text-sm mb-1">
                        {t(col.heading)}
                      </h4>
                    )}
                    <ul className="space-y-1">
                      {col.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-300 transition"
                          >
                            {t(link.name)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ) : (
            <li key={item.title}>
              <Link
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-green-900 dark:text-green-300 bg-green-100 dark:bg-gray-700 rounded-md hover:bg-green-200 dark:hover:bg-gray-600 font-medium"
              >
                {t(item.title)}
              </Link>
            </li>
          )
        )}
      </ul>

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Utility Section */}
      <div className="flex flex-col gap-5">
        {/* Dark Mode Switch */}
        <div className="flex justify-between items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {t("Dark Mode")}
          </span>
          <DarkModeToggle />
        </div>

        {/* Language Switcher */}
        <div className="flex justify-between items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {t("Language")}
          </span>
          <LanguageSwitcher />
        </div>

        {/* Auth Buttons */}
        <div className="mt-1">
          <AuthButtons isMobile={true} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </div>
  );
}
