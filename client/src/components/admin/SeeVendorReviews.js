import React, { useState } from "react";
import axios from "axios";

const SeeVendorReviews = () => {
  const [vendorEmail, setVendorEmail] = useState('');
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.post("http://localhost:3001/view-vendor-ratings", {
        type: 'view-vendor-ratings',
        query: vendorEmail,
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSearchChange = (event) => {
    setVendorEmail(event.target.value);
  };

  const handleSearchClick = () => {
    fetchReviews();
  };

  return (
    <div>
      <h1>Vendor Reviews</h1>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by vendor email"
        value={vendorEmail}
        onChange={handleSearchChange}
      />
      {/* Search button */}
      <button onClick={handleSearchClick}>Search</button>
      <ul>
        {reviews.map((review, index) => (
          <li key={index}>
            <p>
              <strong>Vendor:</strong> {review.customer_email}
            </p>
            <p>
              <strong>Rating:</strong> {review.rating}
            </p>
            <p>
              <strong>Description:</strong> {review.comment}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeeVendorReviews;