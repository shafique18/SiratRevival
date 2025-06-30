import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", paddingTop: 60 }}>
      <h2>User Profile</h2>
      {user ? (
        <>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {/* Add more user info here if available */}
          <button onClick={handleLogout} style={{ padding: "10px 20px" }}>
            Logout
          </button>
        </>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default Profile;
