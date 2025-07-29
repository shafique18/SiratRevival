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
      <option value="ar">العربية</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
      <option value="it">Italiana</option>
      <option value="hi">हिंदी</option>
      <option value="id">Indonesia</option>
      <option value="ja">日本語</option>
      <option value="pt">Português</option>
      <option value="tr">Türkçe</option>
      <option value="ur">اردو</option>
      <option value="zh">中文</option>

      {/* Add more languages here */}
    </select>
  );
};

export default LanguageSwitcher;
