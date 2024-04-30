import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import logoImage from "../styles/logo.png";
import settingImage from "../styles/settings.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = window.sessionStorage.getItem("role");

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
            <button
              className={location.pathname === "/CustomerHome" ? "active" : ""}
              onClick={() => handleNavigate("/CustomerHome")}
            >
              Homepage
            </button>
            <button
              className={location.pathname === "/CurrentOrder" ? "active" : ""}
              onClick={() => handleNavigate("/CurrentOrder")}
            >
              Current Order
            </button>
            <button
              className={location.pathname === "/PlaceOrder" ? "active" : ""}
              onClick={() => handleNavigate("/PlaceOrder")}
            >
              Place Order
            </button>
            <button
              className={location.pathname === "/ViewCart" ? "active" : ""}
              onClick={() => handleNavigate("/ViewCart")}
            >
              View Cart
            </button>
            <button
              className={location.pathname === "/CustomerReview" ? "active" : ""}
              onClick={() => handleNavigate("/CustomerReview")}
            >
              Leave Review
            </button>
            <button
              className={location.pathname === "/CustomerViewMenu" ? "active" : ""}
              onClick={() => handleNavigate("/CustomerViewMenu")}
            >
              View Menu
            </button>
            <button
                className={
                    location.pathname === "/CustomerUpdateInfo" ? "active settings-button" : "settings-button"
                }
                onClick={() => handleNavigate("/CustomerUpdateInfo")}
                >
                <img src={settingImage} alt="Settings" />
            </button>
          </>
        )}

{role === "vendor" && (
          <>
          <button
              className={location.pathname === "/VendorHome" ? "active" : ""}
              onClick={() => handleNavigate("/VendorHome")}
            >
              HomePage
            </button>
            <button
              className={location.pathname === "/AddItem" ? "active" : ""}
              onClick={() => handleNavigate("/AddItem")}
            >
              Add an Item
            </button>
            <button
              className={location.pathname === "/VendorOrders" ? "active" : ""}
              onClick={() => handleNavigate("/VendorOrders")}
            >
              View Current Orders
            </button>
            <button
              className={location.pathname === "/ViewCustomersReviews" ? "active" : ""}
              onClick={() => handleNavigate("/ViewCustomersReviews")}
            >
              View Customer Reviews
            </button>
            <button
              className={location.pathname === "/VendorProfile" ? "active" : ""}
              onClick={() => handleNavigate("/VendorProfile")}
            >
              Profile & Analytics
            </button>
        </>
        )}

{role === "courier" && (
          <>
          <button
              className={location.pathname === "/SeeOrders" ? "active" : ""}
              onClick={() => handleNavigate("/SeeOrders")}
            >
              See All Orders
            </button>
            <button
              className={location.pathname === "/courierAnalytics" ? "active" : ""}
              onClick={() => handleNavigate("/courierAnalytics")}
            >
              View analytics
            </button>
          </>
        )}

{role === "admin" && (
          <>
          <button
              className={location.pathname === "/AdminHome" ? "active" : ""}
              onClick={() => handleNavigate("/AdminHome")}
            >
              Home
            </button>
            <button
              className={location.pathname === "/seeVendorRatings" ? "active" : ""}
              onClick={() => handleNavigate("/seeVendorRatings")}
            >
              View Vendor Reviews
            </button>
            <button
              className={location.pathname === "/joinRequests" ? "active" : ""}
              onClick={() => handleNavigate("/joinRequests")}
            >
              View Join Requests
            </button>
            <button
              className={location.pathname === "/banUser" ? "active" : ""}
              onClick={() => handleNavigate("/banUser")}
            >
              Ban User
            </button>
          </>
        )}

        {/* Add similar logic for other roles */}
        {/* Settings button */}
        <button
          className="settings-button"
          onClick={() => handleNavigate("/CustomerUpdateInfo")}
        >
          <img src={settingImage} alt="Settings" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
