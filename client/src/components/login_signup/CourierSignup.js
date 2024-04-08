import "../../styles/CourierSignup.css";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const CourierSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roll_Number, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone_Number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (event) => {
    event.preventDefault();

    if (
      !name ||
      !email ||
      !roll_Number ||
      !phone_Number ||
      !password ||
      password !== confirmPassword
    ) {
      alert(
        "Please ensure all fields are filled correctly and passwords match."
      );
      return;
    }

    if (!validEmail(email)) {
      alert("Please enter a valid email!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/signup", {
        name,
        roll_Number,
        email,
        phone_Number,
        password,
        usertype: "courier",
      });

      if (response.data.token) {
        console.log("Signup successful!");
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        alert("Signup failed. Please try again later.");
      }
    } catch (error) {
      alert(
        `Error during signup: ${error.response?.data?.msg || error.message}`
      );
    }
  };

  return (
    <div className="signup-page">
      <h1 className="signup-header">Courier Signup</h1>
      <div className="partition"></div>
      <form className="form" onSubmit={handleSignup}>
        <input
          className="user-inp"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="user-inp"
          type="text"
          placeholder="Roll Number"
          value={roll_Number}
          onChange={(e) => setRollNumber(e.target.value)}
        />
        <input
          className="user-inp"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="user-inp"
          type="text"
          placeholder="Phone Number"
          value={phone_Number}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          className="pass-inp"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="pass-inp"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="sub-button" type="submit">
          Signup
        </button>
      </form>
      <div className="question">
        Already have an account? <a href="/">Login</a>
      </div>
    </div>
  );
};

export default CourierSignup;
