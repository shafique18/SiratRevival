import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MobileMenu({ menus, setMobileMenuOpen }) {
  const { t } = useTranslation();

  return (
    <ul className="px-6 py-4 space-y-3">
      {menus.map((item) =>
        item.columns ? (
          <details key={item.title} className="group">
            <summary className="cursor-pointer py-2 px-3 rounded hover:bg-green-700">{t(item.title)}</summary>
            <ul className="pl-4 mt-2">
              {item.columns.map((col) =>
                col.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="block py-1 hover:text-green-300" onClick={() => setMobileMenuOpen(false)}>
                      {t(link.name)}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </details>
        ) : (
          <li key={item.title}>
            <Link to={item.path} className="block py-2 px-3 rounded hover:bg-green-700" onClick={() => setMobileMenuOpen(false)}>
              {t(item.title)}
            </Link>
          </li>
        )
      )}
    </ul>
  );
}
