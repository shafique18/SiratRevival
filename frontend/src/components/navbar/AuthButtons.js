import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AuthButtons({ isAuthenticated, user, logout }) {
  const { t } = useTranslation();

  return isAuthenticated ? (
    <div className="flex items-center space-x-4">
      <Link to="/profile" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
        {user?.username || t("Profile")}
      </Link>
      <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">
        {t("Logout")}
      </button>
    </div>
  ) : (
    <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold">
      {t("Login")}
    </Link>
  );
}
