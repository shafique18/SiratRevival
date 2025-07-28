// LanguageSwitcher.js (same styling as before)
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      aria-label="Select Language"
      className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-base font-medium text-gray-700 dark:text-gray-200
        hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      {/* Add more languages here */}
    </select>
  );
};

export default LanguageSwitcher;
