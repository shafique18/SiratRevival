import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from '../components/Layout';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">User Profile</h2>
          {user ? (
            <>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <button onClick={handleLogout}
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition">
                Logout
              </button>
            </>
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-300">Loading user info...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
