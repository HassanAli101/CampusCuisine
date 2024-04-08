import React from "react";
import { Link } from "react-router-dom";
import "../../styles/MainSignup.css";
import logo from "../../styles/logo.png"; // Adjust the path as necessary

const MainSignup = () => {
  return (
    <div className="MainSignup-page">
      <img src={logo} alt="Logo" className="MainSignup-logo" />
      <h3 className="MainSignup-header">Signup As:</h3>
      <div className="partition"></div>
      <div className="form">
        <Link to="/VendorSignup" className="sub-button">
          Vendor
        </Link>
        <Link to="/StudentVendorSignup" className="sub-button">
          Student Vendor
        </Link>
        <Link to="/CustomerSignup" className="sub-button">
          Customer
        </Link>
        <Link to="/CourierSignup" className="sub-button">
          Courier
        </Link>
      </div>
      <div className="question">
        Already have an account? <Link to="/">Login</Link>
      </div>
    </div>
  );
};

export default MainSignup;
