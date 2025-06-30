import React, { useState } from "react";
import Layout from '../components/Layout';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8000/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.detail || "Failed to send password reset email.");
      } else {
        setMessage("If the email exists, a password reset link has been sent.");
      }
    } catch {
      setErrorMsg("Network error");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-gray-100">
            Request Password Reset
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block font-medium text-gray-800 dark:text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
            {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordResetRequest;
