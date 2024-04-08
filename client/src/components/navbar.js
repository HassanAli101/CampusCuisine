import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./login_signup/AuthContext";
import "../styles/Navbar.css";
import logoImage from "../styles/logo.png";
import settingImage from "../styles/settings.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { role } = authState;

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logoImage} alt="Logo" />
      </div>
      <div className="navbar-links">
        {role === "customer" && (
          <>
            <button onClick={() => handleNavigate("/CustomerHome")}>
              Homepage
            </button>
            <button onClick={() => handleNavigate("/CurrentOrder")}>
              Current Order
            </button>
            <button onClick={() => handleNavigate("/PlaceOrder")}>
              Place Order
            </button>
            <button onClick={() => handleNavigate("/ViewCart")}>
              View Cart
            </button>
            <button onClick={() => handleNavigate("/CustomerReview")}>
              Leave Review
            </button>
          </>
        )}
        {role === "vendor" && (
          <>
          <button onClick={() => handleNavigate("/VendorHome")}>
            Homepage
          </button>
          <button onClick={() => handleNavigate("/AddItem")}>Add Item</button>
          <button onClick={() => handleNavigate("/VendorOrders")}>
            View Current Orders
          </button>
          <button onClick={() => handleNavigate("/ViewCustomersReviews")}>
            View Customer Reviews
          </button>
          <button onClick={() => handleNavigate("/VendorProfile")}>
            Profile & Analytics
          </button>
        </>
        )}
        {/* TO DO ADD NAVIGATION FOR OTHER ACTORS AS WE RECEACH THERI USECSES */}
        {role === "courier" && (
          <>
            <button onClick={() => handleNavigate("/SeeOrders")}>
              See All Orders
            </button>
            <button onClick={() => handleNavigate("/courierAnalytics")}>
              view analytics
            </button>
          </>
        )}
      </div>
      <button className="settings-button">
        <img src={settingImage} alt="Settings" />
      </button>
    </nav>
  );
};

export default Navbar;
