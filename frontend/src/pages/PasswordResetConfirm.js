import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const PasswordResetConfirm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Reset token is missing.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.detail || "Failed to reset password.");
      } else {
        setMessage("Password reset successfully! You can now log in.");
      }
    } catch {
      setErrorMsg("Network error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 60 }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordResetConfirm;
