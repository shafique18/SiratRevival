import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

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

    try {
      const formData = new URLSearchParams();
      formData.append("grant_type", "password");
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMsg(data.detail || "Login failed");
        setLoading(false);
        return;
      }

      const data = await response.json();
      // Assuming JWT token and maybe user data in payload (if not, fetch user profile after login)
      login(data.access_token);
      const profileRes = await fetch("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      if (profileRes.ok) setUser(await profileRes.json());

      setLoading(false);
      navigate("/profile");
    } catch {
      setErrorMsg("Network error");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 60 }}>
      <h2>Login to SiratRevival</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        <Link to="/register">Register</Link> | <Link to="/password-reset-request">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default Login;
