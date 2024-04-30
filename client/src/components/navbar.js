import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "./login_signup/AuthContext";
import "../styles/Navbar.css";
import logoImage from "../styles/campusCuisineSmall.png";
import settingImage from "../styles/gear.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { authState } = useAuth();
  // const { role } = authState;
  const role = window.sessionStorage.getItem('role')
  const status = window.sessionStorage.getItem('status')
  const application = window.sessionStorage.getItem("application")
  // console.log("Role: ", role)

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
        {role === "vendor" &&status&& status==='banned' && (
          <>
          
        </>
        )}
        
        {/* TO DO ADD NAVIGATION FOR OTHER ACTORS AS WE RECEACH THERI USECASES */}
        {(role === "vendor" || role === "courier") && ((application === "processing" || application === "decline")) && (
          <>
          
          </>
        )}
        {role === "courier" && (!application&&(application!=="processing"&&application!=="decline"))&&(
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
            <button
              className={
                  location.pathname === "/CourierUpdateInfo" ? "active settings-button" : "settings-button"
              }
              onClick={() => handleNavigate("/CourierUpdateInfo")}
              >
              <img src={settingImage} alt="Settings" />
          </button> 
          </>
        )}

        {role === "vendor" && ((!status||status!='banned') && (application && (application!=="processing"&&application!=="decline")))&&(
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
            <button
              className={
                  location.pathname === "/VendorUpdate" ? "active settings-button" : "settings-button"
              }
              onClick={() => handleNavigate("/VendorUpdate")}
              >
              <img src={settingImage} alt="Settings" />
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
            <button
              onClick={() => handleNavigate("/")}
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
