import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MegaMenuPanel({ item, activeMegaMenu, setActiveMegaMenu }) {
  const { t } = useTranslation();

  if (!item.columns || activeMegaMenu !== item.title) return null;

  return (
    <AnimatePresence>
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
        onMouseEnter={() => setActiveMegaMenu(item.title)}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-gray-700 dark:text-gray-300">
          {item.columns.map((col, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-5">{t(col.heading)}</h3>
              <ul className="space-y-3" role="none">
                {col.links.map((link) => (
                  <li key={link.name} role="none">
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 hover:text-green-500 transition font-medium"
                      onClick={() => setActiveMegaMenu(null)}
                      role="menuitem"
                    >
                      {link.icon && <span className="text-green-500">{link.icon}</span>}
                      {t(link.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
