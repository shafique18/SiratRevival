import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from '../components/Layout';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMsg("Verification token is missing.");
      setMessage("");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`http://localhost:8000/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.detail || "Verification failed.");
          setMessage("");
        } else {
          setMessage("Email verified successfully! You can now log in.");
          setErrorMsg("");
        }
      } catch {
        setErrorMsg("Network error.");
        setMessage("");
      }
    }

    verify();
  }, [token]);

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-24 p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Email Verification</h2>
        {message && <p className="text-green-600 dark:text-green-400">{message}</p>}
        {errorMsg && <p className="text-red-600 dark:text-red-400">{errorMsg}</p>}
      </div>
    </Layout>
  );
};

export default VerifyEmail;
