import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePopup } from "../context/PopupContext";

import "../styles/registerpage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showPopup } = usePopup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showPopup({
        message: "Passwords do not match!",
        duration: 3000,
        type: "error",
      });
      //  alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
        role,
      });
      console.log(response.data);
      if (response.data.status) {
        showPopup({
          message: "Registration successful!",
          duration: 3000,
          type: "success",
        });
        // alert("Registration successful!");
        navigate("/login");
      } else {
        showPopup({
          message: "Registration failed. Please try again.",
          duration: 3000,
          type: "error",
        });
        // alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div id="register-body">
      <div className="register-container">
        <h1 className="register-title">Register</h1>
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

          <div className="form-group password-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password:
            </label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group dropdown-container">
            <label htmlFor="dropdown" className="form-label">
              Select Role:
            </label>
            <select
              id="dropdown"
              className="form-input dropdown-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
