import React, { useEffect, useState } from "react";
import "../../styles/AdminHome.css";
import axios from 'axios';
import { Chart } from "react-google-charts";

const AdminHome = () => {
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
        temp.sort((a, b) => b.totalPriceOfItemsSold - a.totalPriceOfItemsSold).slice(0,2);

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

  // Transform topVendors data into the format expected by Chart component
  const chartData = allVendors.map(vendor => [vendor.name, vendor.orderCount]);

  const options = {
    title: "",
    backgroundColor: 'transparent',
    legend: {
      textStyle: {
        fontSize: 14,
      },
    },
    width: 500,
    height: 350,
  };

  const scrollList = (direction) => {
    
    const container = document.getElementById('review-list');
    
    const scrollAmount = 600;
  
    if (direction === "left") {
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    } else {
      console.log("Scrolling right", container)
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  

  return (
    // <div className="container">
    <div className='admin-home-container'>
      <div className='fixed-tint'></div>
      {/* Display top vendors */}
      <div className="most-popular-sellers">
        <div className="grey-tape">
        <h1 className="popular-sellers-title">Most Popular Sellers:</h1>
        </div>
        {topVendors.map((vendor, index) => (
          <div className="vendor-card" key={index}>
            <p className="vendor-name">{vendor.name}</p>
            <div className="price-range-container">
              <p className="vendor-price-range">Price Range: {vendor.minPrice} - {vendor.maxPrice}
              <div className="dollar-logo"></div>
              </p>
            </div>
            <div className="review-rating-container-2">
              <p className="vendor-average-rating">Rating: {Math.round(vendor.avgRating)}</p>
              <div className="star-logo-2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Display pie chart */}
      <div className="pie-chart">
        <h2 className="pie-chart-title">Number of Orders at Each Restaurant:</h2>
        <Chart className="pie-chart-diagram"
          chartType="PieChart"
          data={[["Name", "Order Count"], ...chartData]} // Include header row
          options={options}
          // width={"100%"}
          // height={"400px"}
        />
      </div>

      {/* Display reviews sidebar */}
      <div className='customer-reviews' style={{ overflowX: "auto", whiteSpace: "nowrap", width: "50%", height: "200px" }}>
      <button className="scroll-button-left" onClick={() => scrollList("left")}>{"<"}</button>
        <div className="second-grey-tape">
          <h2 className="review-title">Most recent reviews:</h2>
        </div>
        <div className="review-list-container" id="review-list">
          <ul className="review-list" >
            {myCustomerReviews.map((review, index) => (
              <li key={index}>
                <p className="vendor-review-name">{review.vendor_name}</p>
                <div className="review-rating-container">
                  <p className="vendor-review-rating">{review.rating}</p>
                  <div className="star-logo"></div> {/* This div will contain the star logo */}
                </div>
                <p className="vendor-review-comment">{review.comment}</p>
              </li>
            ))}
          </ul>
          
        </div>
        <button className="scroll-button-right" onClick={() => scrollList("right")}>{">"}</button>
      </div>
    </div>
  );
};

export default AdminHome;
