import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/vendorCss/ViewCustomerReviews.css';

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [isBanned, setIsBanned] = useState(false);
    const navigate = useNavigate();
    const vendorEmail = window.localStorage.getItem('vendorEmail');

    useEffect(() => {
        const checkBannedStatus = async () => {
            try {
                const response = await axios.post('http://localhost:3001/is-vendor-banned', { email: vendorEmail });
                setIsBanned(response.data.isBanned);
                if (response.data.isBanned) {
                    alert('You have been banned: ' + response.data.banDescription);
                }
            } catch (error) {
                console.error('Error checking banned status:', error);
            }
        };

        // Check banned status on component mount
        checkBannedStatus();
    }, [vendorEmail]); // Add vendorEmail to the dependency array

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
        <div>
            <h1>Customer Reviews</h1>
            <button onClick={getReviews} disabled={isBanned}>Get Reviews</button>
            {isBanned && <p>You are banned. You cannot view reviews.</p>}
            <ul>
                {reviews.map((review, index) => (
                    <li key={index}>
                        <strong>Customer Email:</strong> {review.customer_email} - <strong>Rating:</strong> {review.rating} - <strong>Comment:</strong> {review.comment}
                    </li>
                ))}
                {reviews.length === 0 && <li>No reviews found for this vendor.</li>}
            </ul>
        </div>
    );
}

export default Reviews;
