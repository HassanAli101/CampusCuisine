import '../../styles/vendorCss/vendorHome.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VendorHome = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isBanned, setIsBanned] = useState(false);
  const [banDescription, setBanDescription] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('');
  const email = window.sessionStorage.getItem('email');

  useEffect(() => {
    if (applicationStatus === 'decline'){
      alert("Your application has been declined.")
      return;
    }
    const fetchItems = async () => {
      try {
        const response = await axios.post('http://localhost:3001/showitems', { vendorEmail: email });
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    const checkBannedStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-vendor-banned', { email });
        if (response.data.isBanned) {
          setIsBanned(true);
          window.sessionStorage.setItem('status', 'banned')
          setBanDescription(response.data.banDescription);
        }
      } catch (error) {
        console.error('Error checking banned status:', error);
      }
    };

    const checkApplicationStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-application-approved', { email, user_role: 'vendor' });
        const status = response.data.decision;
        if (status === 'approve') {
          fetchItems();
          window.sessionStorage.setItem('application', 'approve')
        } else if (status === 'decline') {
          // alert('Your application has been declined.');
          window.sessionStorage.setItem('application', 'decline')
          setApplicationStatus('declined')
        } else {
          setApplicationStatus('processing');
          window.sessionStorage.setItem('application', 'processing')
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    };

    // Initial calls to fetch items, check banned status, and application status
    const interval = setInterval(() => {
      checkBannedStatus();
      
      checkApplicationStatus();
    }, 3000);

    // Cleanup function to clear interval
    return () => clearInterval(interval);
  }, [email]);

  const updateStock = async (itemId, newStock) => {
    try {
      await axios.post('http://localhost:3001/updateStockVendor', { itemId, newStock });
      const updatedItems = items.map(item =>
        item.itemId === itemId ? { ...item, stock: newStock } : item
      );
      setItems(updatedItems);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className="content-container"> {/* Add class to style */}
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
        <div>
          <h1>Welcome</h1>
          <div className="items-container">
            {items.map(item => (
              <div key={item.itemId} className="item-card">
                <h2>{item.itemName}</h2>
                <p>Category: {item.category}</p>
                <p>Stock: {item.stock}</p>
                <div>
                  <button onClick={() => updateStock(item.itemId, item.stock - 1)}>-</button>
                  <button onClick={() => updateStock(item.itemId, item.stock + 1)}>+</button>
                </div>
                <img src={item.image} alt={item.itemName} className="item-image" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorHome;
