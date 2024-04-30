//Page Author: Hassan Ali
import "../../styles/CustomerReview.css";
// usestate to store the input values, learnt from: https://www.youtube.com/watch?v=5e9_hp0nh1Q
import { useState } from "react";
// axios to make get requests to the server, learnt from: https://www.youtube.com/watch?v=RQM5UyDrNDc
import axios from 'axios';
// use navigate to redirect to another page, learnt from: https://www.youtube.com/watch?v=162Lm52CTBM
import {useNavigate} from 'react-router-dom'

const CustomerReview = (props) => {
  const navigate = useNavigate();
  // initializing input variables and their respective set functions using useState
  const [vendor_email, setVendor] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setDescription] = useState("");

  // asynchronous function to handle the review submission
  const handleReview = async (event) => {
    event.preventDefault();
    if (!vendor_email || !rating || !comment) { // check if all fields are filled
      alert("Please fill in all required fields.");
      return;
    }

    // get the customer email from local storage, learnt from https://www.youtube.com/watch?v=A98SPz5XLwY
    const customer_email = window.sessionStorage.getItem('email');
    console.log("customer_email", customer_email); 

    try {
      // get the orders from the server
      const response = await axios.get('http://localhost:3001/order'); 
      if (response.status === 200) {
        // console.log statements for debugging :p
        console.log("orders fetched!");
        const orders = response.data;
        console.log("orders", orders);
        // finding an instance of the order where the vendor email and customer email match the input values to check if they even ordered from vendor
        const order = orders.find(order => order.vendorEmail === vendor_email && order.clientEmail === customer_email);
        console.log("order", order);
        // if they didnt order, then:
        if (!order) {
          alert("You have not ordered from this vendor.");
          return;
        }
      } else {
        console.error('Failed to fetch orders:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }

    // log the review to the server
    try {
      const response = await axios.post("http://localhost:3001/logreview", {     
        vendor_email,
        customer_email,
        rating,
        comment,
      type: "review",
      usertype: "customer",});

      if (response.status === 200) {
        // if successsful, log the review and redirect to customer home
        console.log("review logged!");
        navigate('/CustomerHome');
      } else {
        console.error("review log failed:", await response.text());
      }
    } catch (error) {
      console.error("error logging review::", error.message);
    }
  };

  // function to validate the rating input, took slight help from Chat-GPT
  const ValidateRating = (e) => {
    const inputRating = e.target.value;
    if (inputRating > 5 || inputRating < 0) {
      alert("Rating must be within 0-5.");
    } else {
      setRating(inputRating);
    }
  };

  return (
    // most of this code is from the skeleton one uploaded in the DB course, however, i'll just walk through some of the changes i made
    // using onsubmit to call handlereview when form submitted (i.e when the submit button is clicked)
    //using onchange to call the respective set function when the input value changes
    // using validate rating to ensure the rating is not greater than 5
    <div className='maindiv'>
      <h1 >
        Review your vendor
      </h1>
      <div className="partition"></div>
      <form className="form" onSubmit={handleReview}> 
        <div>
          <input
            className="user-inpCR"
            type="textarea"
            placeholder="Vendor Email"
            value={vendor_email}
            onChange={(e) => setVendor(e.target.value)}
          />
        </div>
        <div>
          <input
            className="user-inpCR"
            type="textarea"
            placeholder="Description"
            value={comment}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <input
            className="user-inpCR"
            type="number"
            placeholder="Rating /5"
            value={rating}
            onChange={ValidateRating}
          />
        </div>
        <div>
          <button className="sub-button" type="submit">
            Submit Review
          </button>
        </div>
      </form>
      <div className="question">
        Go back to <a href="/CustomerHome">Home</a>
      </div>
    </div>
  );
};

export default CustomerReview;