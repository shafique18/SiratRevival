// src/pages/Login.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Layout from '../components/Layout';
import DynamicMessage from "../components/DynamicMessage";

const roleHomeMap = {
  ADMIN: "/admin/homeadmin",
  GROUP_0_5: "/kids/homekid",
  GROUP_6_15: "/teen/hometeen",
  GROUP_16_25: "/young/homeyoung",
  GROUP_26_PLUS: "/adult/homeadult",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const userProfile = await login(email, password); // login returns user profile or null

    setLoading(false);

    if (userProfile) {
      const redirectPath = roleHomeMap[userProfile.user_role] || "/";
      navigate(redirectPath);
    } else {
      setErrorMsg("Invalid credentials or network error.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-all duration-300">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-300">

          {/* Left - Form */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Welcome Back</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="text-center mt-4 text-sm text-gray-700 dark:text-gray-300 space-x-2">
              <Link to="/register" className="text-blue-500 hover:underline">Register</Link> |{" "}
              <Link to="/password-reset-request" className="text-blue-500 hover:underline">Forgot Password?</Link>
            </div>
          </div>

          {/* Right - Quote Section */}
          <div className="bg-gradient-to-br from-green-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-8 flex flex-col justify-center items-center md:items-start">
            <div className="max-w-md w-full">
              <DynamicMessage />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
