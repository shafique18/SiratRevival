import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MegaMenuPanel({ item, activeMegaMenu, setActiveMegaMenu }) {
  const { t } = useTranslation();

  const isOpen = activeMegaMenu === item.title;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={`${item.title}-menu`}
          id={`${item.title}-menu`}
          role="menu"
          aria-label={`${t(item.title)} submenu`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="fixed left-0 top-[100%] w-full z-40 bg-white dark:bg-gray-900 shadow-xl border-t border-green-500"
          onMouseEnter={() => setActiveMegaMenu(item.title)}
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <div className="mx-auto max-w-screen-2xl px-6 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 text-gray-700 dark:text-gray-300">
              {item.columns.map((col, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">
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
                          {link.icon && <span className="text-green-500">{link.icon}</span>}
                          {t(link.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
