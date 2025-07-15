import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="bg-gray-200 dark:bg-gray-700 rounded p-1"
      aria-label="Select Language"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      {/* Add more languages here */}
    </select>
  );
};

export default LanguageSwitcher;
