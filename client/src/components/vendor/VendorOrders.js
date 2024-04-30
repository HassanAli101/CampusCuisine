import '../../styles/vendorCss/VendorOrders.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VendorOrders = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [isBanned, setIsBanned] = useState(false);
  const [banDescription, setBanDescription] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('');
  const vendorEmail = window.localStorage.getItem('vendorEmail');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post('http://localhost:3001/getNewOrders',{ vendorEmail });
        if (response.status === 200) {
          // Filter orders to include only those with delivery attribute set to true
          response.data.forEach(function(item) {
            if (item.hasOwnProperty('delivery')) {
                item.delivery = item.delivery ? 'Yes' : 'No';
            }
          });

          const filteredOrders = response.data;
          setOrders(filteredOrders);
          console.log(orders);
        } else {
          console.error('Failed to fetch orders:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    const checkBannedStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-vendor-banned', { email: vendorEmail });
        if (response.data.isBanned) {
          setIsBanned(true);
          setBanDescription(response.data.banDescription);
        }
      } catch (error) {
        console.error('Error checking banned status:', error);
      }
    };

    const checkApplicationStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-application-approved', { email: vendorEmail, user_role: 'vendor' });
        const status = response.data.decision;
        if (status === 'approve') {
          fetchOrders();
        } else if (status === 'decline') {
          setApplicationStatus('decline');
        } else {
          setApplicationStatus('processing');
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    };

    // Initial calls to fetch orders, check banned status, and application status
    fetchOrders();
    const interval = setInterval(() => {
      checkBannedStatus();
      checkApplicationStatus();
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [vendorEmail]);

  const getNextStatus = (currentStatus) => {
    return currentStatus === 'New' ? 'InProgress' : currentStatus === 'InProgress' ? 'Completed' : 'Completed';
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Display confirmation pop-up based on the newStatus
      if (newStatus === 'InProgress') {
          updateOrderStatus(orderId, newStatus);
        
      } else {
        if (window.confirm('Order Completed?')) {

          // Fetch the order details
          const orderDetails = await axios.get(`http://localhost:3001/order/${orderId}`);

          // Extract the email stored in the delivered_by attribute of the order
          const orderCourierEmail = orderDetails.data.delivered_by;

          // Verify if the courier's email matches the email stored in the delivered_by attribute
          updateOrderStatus(orderId, newStatus);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3001/order/update`, {
        orderId: orderId,
        newStatus: newStatus,
        delivered_by: ''
      });

      if (response.status === 200) {
        const updatedOrders = orders.map(order => {
          if (order._id === orderId) {
            return { ...order, status: newStatus };
          }
          return order;
        });
        setOrders(updatedOrders);
        console.log('Order status updated successfully:', response.data.updatedOrder);
      } else {
        console.error('Failed to update order status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error.message);
    }
  };

  return (
    <div className="order1-container">
      <h2>Customer orders</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
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
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center', padding: '15px' }}>Customer Name</th>
                <th style={{ textAlign: 'center', padding: '15px' }}>Item</th>
                <th style={{ textAlign: 'center', padding: '15px' }}>Quantity</th>
                <th style={{ textAlign: 'center', padding: '15px' }}>Total</th>
                <th style={{ textAlign: 'center', padding: '15px' }}>Delivery</th>
                <th style={{ textAlign: 'center', padding: '15px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((orderItem, index) => (
                // Render only if the order status is not "Completed"
                orderItem.status !== 'Completed' && (
                  <tr key={index}>
                    <td style={{ textAlign: 'center', padding: '15px' }}>{orderItem.client}</td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>{orderItem.itemName}</td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>{orderItem.quantity}</td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>{orderItem.total}</td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>{orderItem.delivery}</td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      <button
                        style={{
                          backgroundColor:
                            orderItem.status === 'New'
                              ? 'red'
                              : orderItem.status === 'InProgress'
                              ? 'yellow'
                              : 'green',
                          color: 'Black',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '5px 10px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleStatusChange(orderItem._id, getNextStatus(orderItem.status))}
                      >
                        {orderItem.status}
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;