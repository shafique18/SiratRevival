import React, { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ email, full_name: fullName, password }),
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
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 60 }}>
      <h2>Register for SiratRevival</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
        
        <label>Full Name:</label>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
        
        <label>Password:</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
        
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        
        <button type="submit" style={{ width: "100%", padding: 10 }}>Register</button>
      </form>
    </div>
  );
};

export default Register;
