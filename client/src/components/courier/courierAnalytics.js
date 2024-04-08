import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/courierAnalytics.css';

const CourierAnalytics = () => {
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const courierEmail = getCourierEmail();

  function getCourierEmail() {
    // Retrieve the courier's email from local storage
    return window.localStorage.getItem('CourierEmail');
  }

  useEffect(() => {
    const fetchCompletedOrdersCount = async () => {
      try {
        const orderCountResponse = await axios.get(`http://localhost:3001/orders/count/${courierEmail}`);
        if (orderCountResponse.status === 200) {
          setCompletedOrdersCount(orderCountResponse.data.completedOrdersCount);
        } else {
          console.error('Failed to fetch completed orders count:', await orderCountResponse.text());
        }

        const earningsResponse = await axios.get(`http://localhost:3001/courier/earnings/${courierEmail}`);
        if (earningsResponse.status === 200) {
          setTotalEarnings(earningsResponse.data.earnings);
        } else {
          console.error('Failed to fetch total earnings:', await earningsResponse.text());
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchCompletedOrdersCount();
  }, [courierEmail]);

  return (
    <div>
      
      <h1>Welcome {courierEmail}</h1>
      <div className="container">
        <div className="stats-container">
          <div className="stat-box">
            <h2>Number of Orders Completed</h2>
            <p className="stat-value">{completedOrdersCount}</p>
          </div>
          <div className="stat-box">
            <h2>Total Earnings</h2>
            <p className="stat-value">{totalEarnings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourierAnalytics;
