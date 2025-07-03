import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from '../components/Layout';

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name: fullName,
          password,
          age_group: ageGroup,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.detail || "Registration failed");
      } else {
        setMessage("Registration successful! Please check your email to verify your account.");
      }
    } catch (error) {
      setErrorMsg("Network error");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
            Register for SiratRevival
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-800 dark:text-gray-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-gray-800 dark:text-gray-200">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-gray-800 dark:text-gray-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-gray-800 dark:text-gray-200">Age Group</label>
              <div>&nbsp;</div>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select Age Group</option>
                <option value="GROUP_0_5">Kid (0–5)</option>
                <option value="GROUP_6_15">Young (06–15)</option>
                <option value="GROUP_16_25">Adult (16–25)</option>
                <option value="GROUP_26_PLUS">Adult (26+)</option>
              </select>
            </div>

            {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
            >
              Register
            </button>
          </form>
          <div className="text-center mt-4 text-sm text-gray-700 dark:text-gray-300">
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
