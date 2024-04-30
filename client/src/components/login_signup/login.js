import "../../styles/login.css";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import lumsBackground from "../../styles/lums_background.jpg";
import logoImage from "../../styles/campusCuisine.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

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
      if (response.data.msg === "User not found") {
        setErrorMessage("User not found!");
      } else if (response.data.msg === "Incorrect password") {
        setErrorMessage("Incorrect password!");
      }
      else if (response.status === 200 && response.data.token) {
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
            window.sessionStorage.setItem('role', 'vendor')
            window.sessionStorage.setItem("email", email);
            break;
          case "customer":
            window.localStorage.setItem("CustomerEmail", email);
            window.sessionStorage.setItem('role', 'customer')
            window.sessionStorage.setItem("email", email);
            // console.log("set item customer: ", email);
            navigate("/CustomerHome");
            break;
          case "courier":
            window.localStorage.setItem("CourierEmail", email);
            window.sessionStorage.setItem('role', 'courier')
            navigate("/CourierHome");
            break;
          case "admin":
            window.localStorage.setItem("AdminEmail", email);
            window.sessionStorage.setItem('role', 'admin')
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
        
        
      >



<h1 style={{ color: "black", fontFamily: "Roboto, sans-serif" }}>WELCOME TO <span style={{ color: "white", fontFamily: "Dancing Script, sans-serif" }}>CAMPUS CUISINE</span></h1>

        {/* <h3 style={{ color: "#fff" }}>Feeling Hungry?</h3>
        <h3 style={{ color: "#fff" }}>Feeling Tired?</h3>
        <h3 style={{ color: "#fff" }}>Feeling down?</h3> */}
        <h3 style={{ color: "#003249", fontFamily: "Roboto, Cursive" }}>Revolutionize your dining experience with our all-in-one food delivery and service app. Seamlessly connecting customers, vendors, and couriers, we bring delicious meals straight to your doorstep or if you are feeling adventurous, book your meals and go get them from the vendors yourself!!!</h3>







      </div>
      <div className="login-right" style={{ paddingLeft: '120px' }}>
        <img src={logoImage} alt="Logo" className="login-logo" />
        <h2 className="login-title">Log in</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-email-input"
          />
          <input
            type="password"
            placeholder="Password*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-password-input"
          />
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="signup-redirect">
          No account? <a href="/MainSignup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
