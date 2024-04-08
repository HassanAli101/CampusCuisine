// Shehbaz
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import '../../styles/vendorCss/vendorProfile.css'; // Import your CSS file for profile styling

const VendorProfile = () => {
  //const navigate = useNavigate();
  const [vendorDetails, setVendorDetails] = useState({});
  const [totalOrders, setTotalOrders] = useState(0);
  const [mostSoldItem, setMostSoldItem] = useState({});
  const [worstSellingItem, setWorstSellingItem] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);

  const vendorEmail = window.localStorage.getItem('vendorEmail');
  const vendorImage = 'https://res.cloudinary.com/dcswark7e/image/upload/v1709190100/ReactDB/lfoqk8xfau0u886nrxuf.jpg'

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        // Fetch vendor details from backend
        const response = await axios.post('http://localhost:3001/vendorAnalytics', { vendorEmail });
        setTotalOrders(response.data.totalOrders);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };

    fetchVendorDetails();
  }, [vendorEmail]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        {/* Image box */}
        <div className="image-box">
          <img src={vendorImage} alt="Vendor" />
        </div>
        {/* Details on the right */}
        <div className="vendor-details">
          <h2>{vendorDetails.name}</h2>
          <p>Vendor Email: {vendorEmail}</p>
          {/* Add other details here */}
        </div>
      </div>
      {/* Cards */}
      <div className="card-container">
        {/* Total orders completed */}
        <div className="card">
          <h3>Total Orders Completed</h3>
          <p>{totalOrders}</p>
        </div>
        {/* Most items sold */}
        <div className="card">
          <h3>Most Items Sold</h3>
          <p>{mostSoldItem.name} ({mostSoldItem.quantity} items)</p>
        </div>
        {/* Worst selling item */}
        <div className="card">
          <h3>Worst Selling Item</h3>
          <p>{worstSellingItem.name}</p>
        </div>
        {/* Total revenue */}
        <div className="card">
          <h3>Total Revenue Made</h3>
          <p>${totalRevenue}</p>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
