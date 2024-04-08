import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/CourierHome.css";
import axios from 'axios';
import { Chart } from "react-google-charts";
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();
  const [topVendors, setTopVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [myCustomerReviews, setMyCustomerReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getInfoForAdminHomePage");
        const { vendorsInfo, myCustomerReviews } = response.data;

        let temp = vendorsInfo;
        // Sort the vendorsInfo array based on totalPriceOfItemsSold in descending order
        temp.sort((a, b) => b.totalPriceOfItemsSold - a.totalPriceOfItemsSold);

        // Set vendors state
        setTopVendors(temp);
        setAllVendors(vendorsInfo);
        setMyCustomerReviews(myCustomerReviews.reverse());
      } catch (err) {
        console.log("Error fetching admin home page info:", err);
      }
    };

    fetchData();
  }, []);

  const handleVendorReviewsClick = () => {
    navigate('/seeVendorRatings')
  }

  const handleBanUserClick = () => {
    navigate('/banUser')
  }

  const handleJoinRequests = () => {
    navigate('/joinRequests')
  }

  // Transform topVendors data into the format expected by Chart component
  const chartData = topVendors.map(vendor => [vendor.name, vendor.orderCount]);

  const options = {
    title: "Vendors Order Count",
  };

  return (
    <div className='container' style={{ maxWidth: "1200px", margin: "0 auto"}}>
      {/* Navigation links */}
      <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <Link className="sub-button-Home" to="/admin/seeVendorRatings" onClick={handleVendorReviewsClick}>
          See Vendor Ratings
        </Link>{" "}
        <br />
        <Link className="sub-button-Home" to="/admin/joinRequests" onClick={handleJoinRequests}>
          View Join Requests
        </Link>{" "}
        <br />
        <Link className="sub-button-Home" to="/admin/banUser" onClick={handleBanUserClick}>
          Ban User
        </Link>
        <br />
      </nav>
      </div>

      {/* Display top vendors */}
      <div>
        <h2>Top Vendors</h2>
        <ul>
          {topVendors?.map((vendor, index) => (
            <li key={index}>
              <p>Name: {vendor.name}</p>
              <p>Price Range: ${vendor.minPrice} - ${vendor.maxPrice}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Display pie chart */}
      {/* <div>
        <h2>Vendors Order Count</h2>
        <Chart
          chartType="PieChart"
          data={[["Name", "Order Count"], ...chartData]} // Include header row
          options={options}
          width={"100%"}
          height={"400px"}
        />
      </div> */}

      {/* Display reviews sidebar */}
      {/* <div className='customer-reviews' style={{ overflowX: "auto", whiteSpace: "nowrap", maxWidth: "100%", marginBottom: "20px" }}>
        <h2>Customer Reviews</h2>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {myCustomerReviews.map((review, index) => (
            <li key={index} style={{ display: "inline-block", margin: "0 10px" }}>
              <p>Customer Email: {review.customer_email}</p>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default AdminHome;
