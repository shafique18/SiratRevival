import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 60 }}>
      <h2>Email Verification</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
};

export default VerifyEmail;
