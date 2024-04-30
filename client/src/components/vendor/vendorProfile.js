import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Pie } from 'react-chartjs-2';
import '../../styles/vendorCss/vendorProfile.css';

const VendorProfile = () => {
  const [vendorDetails, setVendorDetails] = useState();
  const [totalOrders, setTotalOrders] = useState(0);
  const [mostSoldItem, setMostSoldItem] = useState();
  const [worstSellingItem, setWorstSellingItem] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [itemGraphData, setItemGraphData] = useState();
  const [vendorOrderHistory, setVendorOrderHistory] = useState();
  const [isBanned, setIsBanned] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [banDescription, setBanDescription] = useState('');
  
  const vendorEmail = window.localStorage.getItem('vendorEmail');
  const [vendorImage, setVendorImage] = useState();

  useEffect(() => {

    const fetchVendorDetails = async () => {
      try {
        // Fetch vendor details from backend
        const response = await axios.post('http://localhost:3001/vendorDetails', { vendorEmail });
        setVendorImage(response.data.profileImage);

      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };
  
    const fetchTotalOrders = async () => {
      try {
        // Fetch vendor details from backend
        const response = await axios.post('http://localhost:3001/vendorAnalytics', { vendorEmail });
        setTotalOrders(response.data.totalOrders);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };
    const fetchVendorOrderHistory = async () => {
      
      try {
        // Fetch vendor details from backend
        const response = await axios.post('http://localhost:3001/VendorOrderHistory', { vendorEmail });
        setVendorOrderHistory(response.data);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };
    const numEachItemSold = async () => {
      try {
        // Fetch vendor details from backend
        const response = await axios.post('http://localhost:3001/sellData', { vendorEmail });
        setWorstSellingItem(response.data.leastCountItem.itemName);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };
    const mostItemSold = async () => {
      try {
        // Fetch vendor details from backend
        const response = await axios.post('http://localhost:3001/sellDataMostSold', { vendorEmail });
        setMostSoldItem(response.data.mostSoldItem.itemName);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };

    const fetchTotalRevenue = async () => {
      
      try {
        
        const response = await axios.post('http://localhost:3001/calculateTotalRevenue', { vendorEmail });
        setTotalRevenue(response.data.totalRevenue);
      } catch (error) {
        console.error('Error fetching total revenue:', error);
      }
    };
    const fetchItemGraphData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/vendorItemGraphData', { vendorEmail });
        setItemGraphData(response.data);
      } catch (error) {
        console.error('Error fetching Item Graph Data:', error);
      }
    };
    
    fetchVendorOrderHistory();
    fetchItemGraphData();
    fetchTotalRevenue();
    fetchTotalOrders();
    fetchVendorDetails();
    numEachItemSold();
    mostItemSold();


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
        if (response.data.decision === 'decline') {
          alert('Your application has been declined.');
        }
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

  const downloadAnalyticsAsPDF = () => {
    const doc = new jsPDF();
    doc.text('Vendor Analytics', 10, 10);
    doc.text(`Total Orders Completed: ${totalOrders}`, 10, 20);
    doc.text(`Most Items Sold: ${mostSoldItem}`, 10, 30);
    doc.text(`Worst Selling Item: ${worstSellingItem}`, 10, 40);
    doc.text(`Total Revenue Made: $${totalRevenue}`, 10, 50);
    if (itemGraphData && itemGraphData.length > 0) {
      const columns = ['Item Name', 'Count', 'Price', 'Total']; // Column headers
      const rows = itemGraphData.map(entry => {
        return [entry.itemName, entry.count, entry.price, entry.total];
      });
    
      // Get the height of the first table
      const firstTableHeight =  100;
    
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 100 // Adjust the start position as needed
      });
    
      if (vendorOrderHistory && vendorOrderHistory.length > 0) {
        const columns = ['item ID', 'Customer Name', 'Customer Address', 'Total']; // Column headers
        const rows = vendorOrderHistory.map(entry => {
          return [entry.item_id, entry.client, entry.client_addr, entry.total];
        });
    
        doc.autoTable({
          head: [columns],
          body: rows,
          startY: firstTableHeight + 100 // Start after the first table, adjust the gap as needed
        });
      }
    }
    
    doc.save(`Vendor_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    
    <div className="profile-container">
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
      ) : ( <div>
      <div className="profile-header">
        <div className="image-box">
          <img src={vendorImage} alt="Vendor" />
        </div>
        <div className="vendor-details">
          <h2>{vendorDetails}</h2>
          <h2>Vendor Email: {vendorEmail}</h2>
        </div>
      </div>
      <div className="card-container">
        <div className="card">
          <h3>Total Orders Completed</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="card">
          <h3>Most Items Sold</h3>
          <p>{mostSoldItem}</p>
        </div>
        <div className="card">
          <h3>Worst Selling Item</h3>
          <p>{worstSellingItem}</p>
        </div>
        <div className="card">
          <h3>Total Revenue Made</h3>
          <p>${totalRevenue}</p>
        </div>
      </div>
      <div className="download-button">
        <button onClick={downloadAnalyticsAsPDF}>Download Analytics as PDF</button>
      </div>
      </div>)}
    </div>
  );
};

export default VendorProfile;
