// src/pages/Profile.js
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

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
          <p className="text-gray-700 dark:text-gray-300">Loading user info...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">User Profile</h2>
          <div title="Personal Information">
            <h4 className="text-xl font-semibold mb-4 text-left text-gray-900 dark:text-white">Personal Information</h4>
          <p className="text-gray-800 dark:text-gray-200"><strong>Email:</strong> {user.first_name}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Age Group:</strong> {user.middle_name}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Roles:</strong> {user.last_name}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Email:</strong> {user.date_of_birth}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Age Group:</strong> {user.gender}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Roles:</strong> {user.nationality}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Email:</strong> {user.place_of_birth}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Age Group:</strong> {user.preferred_language}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Roles:</strong> {user.language_proficiency}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Email:</strong> {user.time_zone}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Age Group:</strong> {user.ethnicity}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Roles:</strong> {user.marital_status}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Email:</strong> {user.religion}</p>
          <p className="text-gray-800 dark:text-gray-200"><strong>Age Group:</strong> {user.hobbies}</p>
          
          </div>
          
          {/* Add other profile details you get from backend */}
          <button onClick={handleLogout}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition">
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
