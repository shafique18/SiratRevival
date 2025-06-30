import React, { createContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const defaultLang = localStorage.getItem("lang") || "en";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(defaultLang);

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
