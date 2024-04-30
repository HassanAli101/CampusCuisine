import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../styles/MainSignup.css'

const MainSignup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_Number: "",
    password: "",
    confirmPassword: "",
    roll_Number: "",
    hostel: "",
    room_Number: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");

    if (Object.values(formData).some((x) => x === "") && role !== "vendor") {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/signup", {
        ...formData,
        usertype: role,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError("Signup failed. Please try again later.");
      }
    } catch (error) {
      setError(error.response?.data?.msg || "An error occurred during signup.");
    }
  };

  const inputStyle = {
    
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #0056b3", // Dark blue border
    backgroundColor: "#162447", // Dark blue background color
    color: "#f0f0f0", // Text color
    outline: "none",
    "::placeholder": {
      color: "#ccc", // Placeholder text color
    },
  };


  return (
    <div className="main-signup">
      <h1 style={{ textAlign: "center", color: "#000" }}>
        Signup as {role ? role.charAt(0).toUpperCase() + role.slice(1) : "..."}
      </h1>
      <form onSubmit={handleSignup}>
        <select
          className="user-inp"
          value={role}
          onChange={(e) => setRole(e.target.value)}

        >
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="courier">Courier</option>
          <option value="vendor">Vendor</option>
        </select>

        {role && (
          <>
            {role !== "vendor" && (
              <input
                className="item-inp"
                type="textarea"
                placeholder="Roll Number*"
                name="roll_Number"
                value={formData.roll_Number}
                onChange={handleChange}
              />
            )}
            <input
                className="item-inp"
                type="textarea"
              placeholder="Name*"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
                className="item-inp"
                type="textarea"
              placeholder="Email*"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
                className="item-inp"
                type="textarea"
              placeholder="Phone Number*"
              name="phone_Number"
              value={formData.phone_Number}
              onChange={handleChange}
            />
            {role !== "vendor" && (
              <>
                <input
                className="item-inp"
                type="textarea"
                  placeholder="Hostel*"
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                />
                <input
                className="item-inp"
                type="textarea"
                  placeholder="Room Number*"
                  name="room_Number"
                  value={formData.room_Number}
                  onChange={handleChange}
                />
              </>
            )}
            <input
                className="item-inp"
                type="textarea"
              placeholder="Password*"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
                className="item-inp"
                type="textarea"
              placeholder="Confirm Password*"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {error && (
              <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}
            <button
              type="submit"
              className="sub-button"
            >
              Signup
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default MainSignup;
