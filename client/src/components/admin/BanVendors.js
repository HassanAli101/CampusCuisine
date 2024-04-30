import React, { useState } from "react";
import axios from "axios";
import '../../styles/banVendor.css';

const BanVendors = () => {
  const [vendorEmail, setVendorEmail] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState('');

  const handleVendorEmailChange = (event) => {
    setVendorEmail(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const banVendor = async () => {
    try {
      const response = await axios.post("http://localhost:3001/ban-vendor", {
        type: 'ban-vendor',
        email_to_ban: vendorEmail,
        reason: description,
      });
      console.log("Resopnse: ", response.data)
      if (response.status === 200 && response.data.valid) {
        setMessage("Vendor with email " + vendorEmail + " banned successfully!");
      } else if (response.status === 200 && !response.data.valid) {
        setMessage("Vendor with email " + vendorEmail + " not found!");
      }
      // Reset form fields after banning
      setVendorEmail('');
      setDescription('');
      // Hide confirmation dialog
      setShowConfirmation(false);
    } catch (err) {
      console.error("Error while banning vendor:", err);
    }
  };

  const handleBanClick = () => {
    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleProceed = () => {
    // Call banVendor function if user proceeds
    banVendor();
  };

  const handleCancel = () => {
    // Hide confirmation dialog if user cancels
    setShowConfirmation(false);
  };

  return (
    <div className='maindiv' >    
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Ban Vendors</h1>
      <div style={{ marginBottom: '20px' }}>
        {/* Vendor Email input */}
        <label htmlFor="vendorEmail" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Vendor Email:</label>
        <input
          type="textarea"
          id="vendorEmail"
          value={vendorEmail}
          onChange={handleVendorEmailChange}
          // style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          className="user-inp"
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        {/* Description input */}
        <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Description:</label>
        <input
        type="textarea"
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          // style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          className="user-inp"
        />
      </div>
      {/* Ban button */}
      <button onClick={handleBanClick} style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Ban</button>

      {/* Confirmation dialog */}
      {showConfirmation && (
        <div style={{ marginTop: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)' }}>
          <p style={{ marginBottom: '10px', color: '#555' }}>This action is irreversible. Are you sure you want to proceed?</p>
          <button onClick={handleProceed} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#d9534f', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Proceed</button>
          <button onClick={handleCancel} style={{ padding: '10px 20px', backgroundColor: '#ccc', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      {/* Display message */}
      {message && <p style={{ marginTop: '20px', color: '#555' }}>{message}</p>}
    </div>
  );
};

export default BanVendors;
