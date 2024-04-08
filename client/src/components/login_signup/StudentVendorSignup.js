import "../../styles/StudentVendorSignup.css";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const isPasswordStrong = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[@#$%^&*!()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)
  );
};

const StudentVendorSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_Number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roll_Number, setRollNumber] = useState("");
  const [hostel, setHostel] = useState("");
  const [room_Number, setRoomNumber] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !name ||
      !email ||
      !phone_Number ||
      !password ||
      !confirmPassword ||
      !roll_Number ||
      !hostel ||
      !room_Number
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isPasswordStrong(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, and special characters."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/signup", {
        name,
        email,
        phone_Number,
        password,
        roll_Number,
        hostel,
        room_Number,
        usertype: "student_vendor",
      });

      if (response.data.token) {
        console.log("Signup successful!");
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError("Signup failed. Please try again later.");
      }
    } catch (error) {
      setError(error.response?.data?.msg || "An error occurred during signup.");
    }
  };

  return (
    <div className="signup-page">
      <h1 className="signup-header">Student Vendor Signup</h1>
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
          className="user-inp"
          type="text"
          placeholder="Roll Number"
          value={roll_Number}
          onChange={(e) => setRollNumber(e.target.value)}
        />
        <input
          className="user-inp"
          type="text"
          placeholder="Hostel"
          value={hostel}
          onChange={(e) => setHostel(e.target.value)}
        />
        <input
          className="user-inp"
          type="text"
          placeholder="Room Number"
          value={room_Number}
          onChange={(e) => setRoomNumber(e.target.value)}
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
        {error && <div className="error-message">{error}</div>}
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

export default StudentVendorSignup;
