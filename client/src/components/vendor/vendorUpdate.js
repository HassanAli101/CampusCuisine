import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/vendorCss/vendorUpdate.css';

const VendorUpdate = () => {
  const navigate = useNavigate();
  const vendorEmail = window.sessionStorage.getItem('email');
  const [isBanned, setIsBanned] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [banDescription, setBanDescription] = useState('');
  const [field, setField] = useState('');
  const [value, setValue] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkBannedStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-vendor-banned', { email: vendorEmail });
        setIsBanned(response.data.isBanned);
        if (response.data.isBanned) {
          alert('Unfortunately, you have been banned from further actions: ' + response.data.banDescription);
          setBanDescription(response.data.banDescription);
        }
      } catch (error) {
        console.error('Error encountered while checking banned status:', error);
      }
    };

    const checkApplicationStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-application-approved', { email: vendorEmail, user_role: 'vendor' });
        setApplicationStatus(response.data.decision);
        if (response.data.decision === 'decline') {
          alert('Your application has been declined.');
        }
      } catch (error) {
        console.error('Error encountered while checking application status:', error);
      }
    };

    // Set interval to check banned status and application status every 10 seconds
    const interval = setInterval(() => {
      checkBannedStatus();
      checkApplicationStatus();
    }, 10000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [vendorEmail]);

  const handleAddItem = async (event) => {
    event.preventDefault();

    if (!imageLink) {
      alert('Please ensure all fields are filled.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/updateVendorImage', { email: vendorEmail, imageLink });

      if (response.status === 200) {
        console.log('Image added successfully!');
        alert('Image uploaded successfully!');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error encountered while adding image:', error.message);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleUpdateInfo = async (event) => {
    event.preventDefault();
    console.log("field", field);
    console.log("value", value);
    if (!field || !value) {
      alert("Please make sure all required fields are filled.");
      return;
    }


    console.log("vendor_email", vendorEmail);

    try {
      const response = await axios.post("http://localhost:3001/VendorUpdateInfo", {
        field,
        value,
        vendorEmail,
        type: "review",
        usertype: "vendor",
      });

      if (response.status === 200) {
        console.log("Update info recorded successfully!");
        navigate('/VendorHome');
      } else {
        console.error("Failed to record update:", await response.text());
      }
    } catch (error) {
      console.error("Error encountered while logging update:", error.message);
    }
  };

  const handleLogOut = () => {
    window.sessionStorage.clear();
    navigate('/');
  };

  const handleImageUpload = async (e) => {
    setLoading(true);

    const selectedImage = e.target.files[0];

    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('upload_preset', 'pv6cd033');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dcswark7e/image/upload', formData);

      if (response.status === 200) {
        setImageLink(response.data.secure_url);
      } else {
        throw new Error('Failed to upload image to Cloudinary');
      }
    } catch (error) {
      console.error('Error encountered while uploading image to Cloudinary:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-image">
      {isBanned ? (
        <div>
          <h1>Sorry, You are Banned!</h1>
          <p>{banDescription}</p>
        </div>
      ) : applicationStatus === 'processing' ? (
        <div>
          <h1>Application in Progress</h1>
          <p>Your application is currently being processed. Please wait for approval.</p>
        </div>
      ) : applicationStatus === 'decline' ? (
        <div>
          <h1>Application Declined</h1>
          <p>Unfortunately, your application has been declined. Better luck next time!</p>
        </div>
      ) : (
        <div>
          <div className="partition"></div>
          <form className="form" onSubmit={handleAddItem}>
  <div>
    <h1>Update Your Personal Information</h1>
    <select className="user-inp" onChange={(e) => setField(e.target.value)}>
      <option value="">Select Field</option>
      <option value="name">Name</option>
      <option value="phone_Number">Phone Number</option>
    </select>
    <input
      className="item-inp"
      type="textarea"
      placeholder="Enter new value"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
    <button className="sub-button logout-button" onClick={handleLogOut}>
  Log out
</button>
  </div>
  <div>
    <h6>Updtae Profile Image</h6>
    <input
      className="item-inp"
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
    />
    {loading && <div className="loading-icon">Loading...</div>}
  </div>
  <div>
    <button className="sub-button" type="submit" disabled={isBanned}>
      {isBanned ? 'Banned: Unable to Update Image' : 'Update Image'}
    </button>
    {/* Move the Update Info button here */}
    <button className="sub-button" onClick={handleUpdateInfo}>
      Update Info
    </button>
  </div>
</form>
        </div>
      )}
    </div>
  );
};

export default VendorUpdate;
