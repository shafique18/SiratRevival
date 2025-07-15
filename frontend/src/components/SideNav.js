import React, { useContext, useEffect, useState, useRef } from "react";
import axiosInstance from "./axiosInstance";
import AuthContext from "../context/AuthContext";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";

const SideNav = ({ onSelectMenu }) => {
  const { authTokens } = useContext(AuthContext);
  const [menus, setMenus] = useState([]);
  const [collapsedMenus, setCollapsedMenus] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef();

  // Fetch menus on authTokens change
  useEffect(() => {
    if (!authTokens) return;
    setLoading(true);
    axiosInstance(authTokens.access_token)
      .get("/users/menu")
      .then((res) => {
        setMenus(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch menu error:", err);
        setLoading(false);
      });
  }, [authTokens]);

  // Close mobile menu when clicking outside nav
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileOpen(false);
      }
    };
    if (isMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileOpen]);

  const toggleCollapse = (menuId) => {
    setCollapsedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleMenuClick = (menu) => {
    if (menu.submenus?.length) {
      toggleCollapse(menu.id);
      if (menu.submenus[0]) {
        onSelectMenu({
          ...menu.submenus[0].learning_path,
          type: "learning_path",
        });
      }
    } else {
      onSelectMenu(menu);
    }

    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileOpen}
        aria-controls="side-navigation"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation */}
      <nav
        ref={navRef}
        id="side-navigation"
        className={`bg-white dark:bg-gray-900 w-64 h-full fixed top-16 left-0 border-r border-gray-200 dark:border-gray-700 shadow-md z-30 transform transition-transform duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >
        <div className="h-full overflow-y-auto py-6 px-4">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 select-none">
              Loading...
            </div>
          ) : (
            <ul className="space-y-2">
              {menus.map((menu) => (
                <li key={menu.id}>
                  <button
                    className="w-full flex justify-between items-center text-left px-3 py-2 rounded-md
                      text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
                      focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onClick={() => handleMenuClick(menu)}
                    aria-expanded={collapsedMenus[menu.id] || false}
                  >
                    <span className="truncate">{menu.title}</span>
                    {menu.submenus?.length > 0 && (
                      collapsedMenus[menu.id] ? (
                        <ChevronUp size={16} className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                      )
                    )}
                  </button>

                  {menu.submenus && collapsedMenus[menu.id] && (
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400 overflow-hidden transition-all duration-300">
                      {menu.submenus.map((submenu) => (
                        <li key={submenu.id}>
                          <button
                            className="w-full text-left px-3 py-1 rounded-md
                              hover:bg-gray-100 dark:hover:bg-gray-800
                              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onClick={() =>
                              onSelectMenu({
                                ...submenu.learning_path,
                                type: "learning_path",
                              })
                            }
                          >
                            {submenu.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default SideNav;
