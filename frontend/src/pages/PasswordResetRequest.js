import React, { useState } from "react";

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
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 60 }}>
      <h2>Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default PasswordResetRequest;
