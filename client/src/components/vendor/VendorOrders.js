//Shehbaz
import '../../styles/vendorCss/VendorOrders.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const vendorEmail = window.localStorage.getItem('vendorEmail');
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders from your backend API
        const response = await axios.post('http://localhost:3001/getNewOrders',{ vendorEmail });
        setOrders(response.data); // Assuming your API returns orders in JSON format
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Orders Placed by Customers</h1>
      <div className="order-list">
        {orders.map(order => (
          <div key={order.itemId} className="order-item">
            <h2>Item: {order.itemName}</h2>
            <p>Customer Name: {order.client} </p>
            <p>quantity: {order.quantity} </p>
            <p>Order Total: {order.price} </p>
            <img src={order.image}  className="item-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorOrders;
