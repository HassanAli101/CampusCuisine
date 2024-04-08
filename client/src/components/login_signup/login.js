import "../../styles/login.css";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import lumsBackground from "../../styles/lums_background.png";
import logoImage from "../../styles/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useAuth();

  const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!validEmail(email)) {
      alert("Please enter a valid email!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      if (response.status === 200 && response.data.token) {
        console.log("Login successful!");
        console.log("Received Token:", response.data.token);
        console.log("Received Role:", response.data.role);
        dispatch({
          type: "LOGIN",
          payload: { role: response.data.role, token: response.data.token },
        });

        switch (response.data.role) {
          case "student_vendor":
            navigate("/StudentVendorHome");
            break;
          case "vendor":
            navigate("/VendorHome");
            window.localStorage.setItem("vendorEmail", email);
            window.sessionStorage.setItem("email", email);
            break;
          case "customer":
            window.localStorage.setItem("CustomerEmail", email);
            window.sessionStorage.setItem("email", email);
            console.log("set item customer: ", email);
            navigate("/CustomerHome");
            break;
          case "courier":
            window.localStorage.setItem("CourierEmail", email);
            navigate("/CourierHome");
            break;
          case "admin":
            window.localStorage.setItem("AdminEmail", email);
            window.sessionStorage.setItem("email", email);
            navigate("/AdminHome");
            break;
          default:
            console.log("Role not recognized:", response.data.role);
        }
      } else {
        console.error(
          "Login failed:",
          response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <div
        className="login-left"
        style={{ backgroundImage: `url(${lumsBackground})` }}
      ></div>
      <div className="login-right">
        <img src={logoImage} alt="Logo" className="login-logo" />
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        <div className="signup-redirect">
          No account? <a href="/MainSignup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
