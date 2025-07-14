import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import AuthContext from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const SideNav = ({ onSelectMenu }) => {
  const { authTokens } = useContext(AuthContext);
  const [menus, setMenus] = useState([]);
  const [collapsedMenus, setCollapsedMenus] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!authTokens) return;
    axiosInstance(authTokens.access_token)
      .get("/users/menu")
      .then((res) => {
        console.log("Menu");
        console.log(res.data);
        setMenus(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch menu error:", err);
        setLoading(false);
      });
  }, [authTokens]);

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
        onSelectMenu({ ...menu.submenus[0], type: "learning_path" });
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
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded shadow-md"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav
        className={`bg-white w-64 h-full fixed top-16 left-0 border-r shadow-md z-30 transform transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >
        <div className="h-full overflow-y-auto py-6 px-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <ul className="space-y-2">
              {menus.map((menu) => (
                <li key={menu.id}>
                  <button
                    className="w-full flex justify-between items-center text-left px-3 py-2 rounded hover:bg-gray-100"
                    onClick={() => handleMenuClick(menu)}
                  >
                    <span>{menu.title}</span>
                    {menu.submenus?.length > 0 && (
                      <span className="text-sm">
                        {collapsedMenus[menu.id] ? "▲" : "▼"}
                      </span>
                    )}
                  </button>
                  {menu.submenus && collapsedMenus[menu.id] && (
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-600">
                      {menu.submenus.map((submenu) => (
                        <li key={submenu.id}>
                          <button
                            className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                            onClick={() => onSelectMenu(submenu)}
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
