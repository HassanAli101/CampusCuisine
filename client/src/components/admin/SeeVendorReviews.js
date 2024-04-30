import React, { useState } from "react";
import axios from "axios";
import "../../styles/SeeVendorReviews.css";

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
    <div className='see-vendor-reviews-container'>
      {/* Search bar */}
      <div className="fixed-tint"></div>
      <div className='input-container'>
      <input
        type="textarea"
        placeholder="Search by vendor email"
        value={vendorEmail}
        onChange={handleSearchChange}
        onKeyDown={handleSearchClick}
        className="user-inp"
      />
      <button className="search-vendor-rating-button" onClick={handleSearchClick}>Search</button>
      </div>
      {/* Search button */}  
      <div className="review-list-container-2">
      <ul className="review-list-2">
        {reviews.map((review, index) => (
          <li key={index}>
          <p className="vendor-review-name-2">{review.customer_email}</p>
          <div className="review-rating-container-2">
            <p className="vendor-review-rating-2">{review.rating}</p>
            <div className="star-logo-2"></div> {/* This div will contain the star logo */}
          </div>
          <p className="vendor-review-comment-2">{review.comment}</p>
        </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default SeeVendorReviews;