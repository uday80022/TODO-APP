import React, { useState, useContext } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { usePopup } from "../context/PopupContext";
import "../styles/loginpage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const { showPopup } = usePopup();

  const navigate = useNavigate();
  const checkLogin = async () => {
    try {
      const response = await axios.post("https://todo-app-backend-jig8.onrender.com/login", {
        username,
        password,
      });
      console.log(response.data);
      if (response.data.status) {
        const userData = {
          id: response.data.id,
          username: response.data.username,
        };
        login(userData);
        showPopup({
          message: "Login successful!",
          duration: 3000,
          type: "success",
        });
        // alert("Login successful!");
        navigate("/home");
      } else {
        showPopup({
          message: "Invalid credentials. Please try again.",
          duration: 3000,
          type: "error",
        });
        // alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    checkLogin();
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group password-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <div className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </form>
    </div>
  );
};
export default LoginPage;
