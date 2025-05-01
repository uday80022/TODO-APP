import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "../styles/Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="app-name">Todo App</h1>
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="user-name">Welcome {user.username} 😀</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <span className="user-name">Hey User 😄</span>
            <Link to="/login" className="login-button">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
