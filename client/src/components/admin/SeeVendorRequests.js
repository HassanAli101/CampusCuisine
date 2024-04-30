import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../../styles/SeeVendorRequests.css';
// import zIndex from "@mui/material/styles/zIndex";

const SeeVendorRequests = () => {
  const [allRequests, setAllRequests] = useState([]);

  const seeRequests = async () => {
    try {
      const myRequests = await axios.get("http://localhost:3001/view-join-requests");
      const allUsers = myRequests.data.allUsers;

      const vendorReqs = allUsers.filter(user => user.userType === 'vendor' || user.userType === 'studentVendor');
      const courierReqs = allUsers.filter(user => user.userType === 'courier');

      const combinedRequests = [...vendorReqs, ...courierReqs].map(request => ({ ...request, type: request.userType === 'vendor' || request.userType === 'studentVendor' ? 'Vendor' : 'Courier' }));
      setAllRequests(combinedRequests);
    } catch (err) {
      console.log("Error while querying for requests:", err);
    }
  };

  useEffect(() => {
    seeRequests();
    const interval = setInterval(() => {
      seeRequests();
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDecision = async (userEmail, decision) => {
    try {
      await axios.post("http://localhost:3001/application-decision", {
        userEmail,
        decision
      });
      setAllRequests(prevRequests => prevRequests.filter(user => user.email !== userEmail));
    } catch (err) {
      console.log("Error while sending application decision:", err);
    }
  };

  return (
    <div className='see-vendor-requests-container'>
      {allRequests.length > 0 ? (
        allRequests.map((request, index) => (
          <div className="request-card" key={index} style={{ flex: '0 0 calc(50% - 20px)', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
            <h3>{request.name}</h3>
            <p>Type: {request.type}</p>
            <p>Phone Number: {request.phone_Number}</p>
            <div style={{ marginTop: '10px' }}>
              <button className="approve-button" onClick={() => handleDecision(request.email, "approve")} style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Approve</button>
              <button className="decline-button" onClick={() => handleDecision(request.email, "decline")} style={{ padding: '10px 20px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Decline</button>
            </div>
          </div>
        ))
      ) : (
        <h1 className="no-requests-message">No current requests</h1>
      )}
    </div>
  );
  
  
  
};

export default SeeVendorRequests;
