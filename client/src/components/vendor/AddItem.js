import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/vendorCss/addItemCustom.css';

const AddItem = () => {
  const navigate = useNavigate();
  const vendorEmail = window.sessionStorage.getItem('email');
  const [isBanned, setIsBanned] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [banDescription, setBanDescription] = useState('');

  useEffect(() => {
    const checkBannedStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-vendor-banned', { email: vendorEmail });
        setIsBanned(response.data.isBanned);
        if (response.data.isBanned) {
          alert('You have been banned: ' + response.data.banDescription);
          setBanDescription(response.data.banDescription)
        }
      } catch (error) {
        console.error('Error checking banned status:', error);
      }
    };

    const checkApplicationStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-application-approved', { email: vendorEmail, user_role: 'vendor' });
        setApplicationStatus(response.data.decision);
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    };

    // Set interval to check banned status and application status every 10 seconds
    const interval = setInterval(() => {
      checkBannedStatus();
      checkApplicationStatus();
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [vendorEmail]);

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddItem = async (event) => {
    event.preventDefault();

    if (!itemName || !category || !stock || !price || !imageLink || !calories) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const formData = {
        itemName,
        category,
        stock,
        price,
        image: imageLink,
        vendorEmail,
        calories,
        type: 'add_item',
      };

      const response = await axios.post('http://localhost:3001/add_item', formData);

      if (response.status === 200) {
        console.log('Item added successfully!');
        alert('Item added successfully!');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error adding item:', error.message);
      alert('Failed to add item. Please try again.');
    }
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
      console.error('Error uploading image to Cloudinary:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-page">
      {isBanned ? (
        <div>
          <h1>You have been banned!</h1>
          <p>{banDescription}</p>
        </div>
      ) : applicationStatus === 'processing' ? (
        <div>
          <h1>Application Processing</h1>
          <p>Your application is currently being processed. Please wait for approval.</p>
        </div>
      ) : applicationStatus === 'decline' ? (
        <div>
          <h1>Application Decision</h1>
          <p>Your application has been denied. Better luck next time, champ!</p>
        </div>
      ) : (
        <>
          <h1 className="add-item-header">ADD ITEM</h1>
          <div className="partition"></div>
          <form className="form" onSubmit={handleAddItem}>
            {/* Input fields */}
            <div>
              <input
                className="item-inp"
                type="textarea"
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            {/* Other input fields */}
            <div>
              <input
                className="item-inp"
                type="textarea"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <input
                className="item-inp"
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <input
                className="item-inp"
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <input
                className="item-inp"
                type="number"
                placeholder="Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            {/* Image upload field */}
            <div>
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
                {isBanned ? 'Banned: Cannot Add Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AddItem;
