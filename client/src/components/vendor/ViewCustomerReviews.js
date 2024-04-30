import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/vendorCss/ViewCustomerReviews.css';

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [isBanned, setIsBanned] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [banDescription, setBanDescription] = useState('');
    const navigate = useNavigate();
    const vendorEmail = window.sessionStorage.getItem('email');

    useEffect(() => {
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

    const getReviews = async () => {
        try {
            const response = await axios.post('http://localhost:3001/ViewCustomerReviews', { vendorEmail });
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            if (error.response) {
                console.error('Server Error:', error.response.data);
            } else if (error.request) {
                console.error('Request Error:', error.request);
            } else {
                console.error('Unexpected Error:', error.message);
            }
        }
    };

    return (
        <div className="container4">
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
            <h1>Customer Reviews</h1>
            <button onClick={getReviews} disabled={isBanned}>Get Reviews</button>
            {isBanned && <p>You are banned. You cannot view reviews.</p>}
            <div className="review-container">
                <div className="review-grid">
                    {reviews.slice(0, 4).map((review, index) => (
                        <div className="review-box" key={index}>
                            <div className="review-details">
                                <strong>Customer Email:</strong> {review.customer_email} <br />
                                <strong>Rating:</strong> {review.rating} <br />
                                <strong>Comment:</strong> {review.comment} <br />
                                <br /> {/* Adding a gap between reviews */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {reviews.length === 0 && <p className="no-reviews">No reviews found for this vendor.</p>}
            </div>)}
        </div>
    );
}

export default Reviews;
