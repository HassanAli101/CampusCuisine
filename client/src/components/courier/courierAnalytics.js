import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/courierAnalytics.css';
import jspdf from 'jspdf';
const CourierAnalytics = () => {
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [completedOrders, setCompletedOrders] = useState([]);
  const courierEmail = getCourierEmail();

  function getCourierEmail() {
    // Retrieve the courier's email from local storage
    return window.localStorage.getItem('CourierEmail');
  }

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/orders/completed/${courierEmail}`);
        if (response.status === 200) {
          setCompletedOrders(response.data.completedOrders);
          setCompletedOrdersCount(response.data.completedOrders.length);
        } else {
          console.error('Failed to fetch completed orders:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching completed orders:', error.message);
      }
    };

    fetchCompletedOrders();
  }, [courierEmail]);
  const downloadAnalyticsAsPDF = () => {
    const doc = new jspdf();
    
    // Add the statistics before the table
    doc.text('Analytics for : ' + courierEmail, 10, 10);
    doc.text('Number of Orders Completed: ' + completedOrdersCount, 10, 20);
    doc.text('Total Earnings: $' + (completedOrdersCount * 50), 10, 30);
    
    
    // Define columns for the table
    const columns = [ 'Vendor Name', 'Pickup Address', 'Customer Name', 'Delivery Address', 'Status'];
    // Map completedOrders data to rows array
    const rows = completedOrders.map(order => [ order.vendor, order.vendor_addr, order.client, order.client_addr, order.status]);
    
    // Add the table to the PDF document
    doc.autoTable({
      head: [columns], // Header row
      body: rows, // Table data rows
      startY: 40 // Start position of the table
    });
  
    doc.save(`Completed_Orders_Report_${new Date().toISOString().slice(0, 10)}.pdf`); // Save the PDF
  };
  
  
  return (
    <div className='maindiv'>
      <h1>Welcome {courierEmail}</h1>
      <div className="container">
        <div className="stats-container">
          <div className="stat-box">
            <h2>Number of Orders Completed</h2>
            <p className="stat-value">{completedOrdersCount}</p>
          </div>
          <div className="stat-box">
            <h2>Total Earnings</h2>
            <p className="stat-value">{completedOrdersCount * 50}</p>
          </div>
        </div>
      </div>
      <div className="form-container">
        <h2>Completed Orders</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Pickup Address</th>
                <th>Customer Name</th>
                <th>Delivery Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody style={{ maxHeight: '300px', overflowY: 'auto' }}> {/* Add inline styles */}
              {completedOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.vendor}</td>
                  <td>{order.vendor_addr}</td>
                  <td>{order.client}</td>
                  <td>{order.client_addr}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="download-button">
        <button onClick={downloadAnalyticsAsPDF}>Download Analytics as PDF</button>
      </div>
    </div>
  );
};

export default CourierAnalytics;
