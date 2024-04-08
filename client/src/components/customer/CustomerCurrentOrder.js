import '../../styles/CustomerHome.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerCurrentOrder = () => {
  const [orders, setOrders] = useState([]);
  const CustomerEmail = window.localStorage.getItem('CustomerEmail');
  const fetchOrders = async () => {
    try {
      // Fetch orders from your backend API
      const response = await axios.post('http://localhost:3001/Customergetneworders',{ CustomerEmail });
      setOrders(response.data); // Assuming your API returns orders in JSON format
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 2000); // 5 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='maindiv'>
      <h3>Your orders placed:</h3>
      <div className="items-container1">
        {orders.map(order => (
          <div key={order.itemId} className="item-card1">
            <h6>Item: {order.itemName}</h6>
            <p>Vendor name: {order.vendor} </p>
            <p>quantity: {order.quantity} </p>
            <p>Order Total: {order.price} </p>
            <p>Order Status: {order.status} </p>
            <p>being delivered by: {order.delivered_by}</p>
            <img src={order.image}  className="item-image1" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerCurrentOrder;