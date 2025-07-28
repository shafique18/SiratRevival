import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-md hover:bg-green-100 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
    >
      {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
    </button>
  );
}
