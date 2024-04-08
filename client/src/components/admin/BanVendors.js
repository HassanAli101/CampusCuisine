import React, { useState } from "react";
import axios from "axios";

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
    <div>
      <h1>Ban Vendors</h1>
      <div>
        {/* Vendor Email input */}
        <label htmlFor="vendorEmail">Vendor Email:</label>
        <input
          type="text"
          id="vendorEmail"
          value={vendorEmail}
          onChange={handleVendorEmailChange}
        />
      </div>
      <div>
        {/* Description input */}
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      {/* Ban button */}
      <button onClick={handleBanClick}>Ban</button>

      {/* Confirmation dialog */}
      {showConfirmation && (
        <div>
          <p>This action is irreversible. Are you sure you want to proceed?</p>
          <button onClick={handleProceed}>Proceed</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}

      {/* Display message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default BanVendors