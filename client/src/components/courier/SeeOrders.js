// SeeOrders.js
//page author: Talha Tariq
import '../../styles/SeeOrders.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeeOrders = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [orders, setOrders] = useState([]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Display confirmation pop-up based on the newStatus
      if (newStatus === 'InProgress') {
        if (window.confirm('Have you picked up the order?')) {
          // If the user confirms, proceed with the status change
          updateOrderStatus(orderId, newStatus);
        }
      } else {
        if (window.confirm('Order Completed?')) {
          // If the user confirms, proceed with the status change
          const courierEmail = getCourierEmail();

          // Fetch the order details
          const orderDetails = await axios.get(`http://localhost:3001/order/${orderId}`);

          // Extract the email stored in the delivered_by attribute of the order
          const orderCourierEmail = orderDetails.data.delivered_by;

          // Verify if the courier's email matches the email stored in the delivered_by attribute
          if (courierEmail !== orderCourierEmail) {
            setErrorMessage('Unauthorized access: You are not authorized to update this order.');            return;
          }
          updateOrderStatus(orderId, newStatus);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error.message);
    }
  };
  const getNextStatus = (currentStatus) => {
    return currentStatus === 'New' ? 'InProgress' : currentStatus === 'InProgress' ? 'Completed' : 'Completed';
  };
  const getCourierEmail = () => {
    // Retrieve the courier's email from local storage
    const email = window.localStorage.getItem('CourierEmail');
    // Return the courier's email
    return email;
  };
  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Retrieve the courier's email from the authentication token or session
      const courierEmail = getCourierEmail(); // Implement this function to get the courier's email
      
      const response = await axios.put(`http://localhost:3001/order/update`, {
        orderId: orderId,
        newStatus: newStatus,
        delivered_by: courierEmail // Include the courier's email in the request
      });
      
      if (response.status === 200) {
        // Update the local state with modified order data
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
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/courierorder');
        if (response.status === 200) {
          // Filter orders to include only those with delivery attribute set to true
          const filteredOrders = response.data.filter(order => order.delivery === true);
          setOrders(filteredOrders);
        } else {
          console.error('Failed to fetch orders:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };
  
    fetchOrders();
  }, []);

  return (
    <div className='maindiv'>
      <h2>Customer orders</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th style={{ textAlign: 'center', padding: '15px' }}>Vendor Name</th>
              <th style={{ textAlign: 'center', padding: '15px' }}>Pickup Address</th>
              <th style={{ textAlign: 'center', padding: '15px' }}>Customer Name</th>
              <th style={{ textAlign: 'center', padding: '15px' }}>Delivery Address</th>
              <th style={{ textAlign: 'center', padding: '15px' }}>Status</th>
            </tr>
          </thead>
            <tbody>
            {orders.map((orderItem, index) => (
              // Render only if the order status is not "Completed"
              orderItem.status !== 'Completed' && (
                <tr key={index}>
                  <td style={{ textAlign: 'center', padding: '15px' }}>{orderItem.vendor}</td>
                  <td style={{ textAlign: 'center', padding: '15px' }}>{orderItem.vendor_addr}</td>
                  <td style={{ textAlign: 'center', padding: '15px' }}>{orderItem.client}</td>
                  <td style={{ textAlign: 'center', padding: '15px' }}>{orderItem.client_addr}</td>
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
    </div>
  );
};

export default SeeOrders;