import "../../styles/CourierHome.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CourierHome = () => {
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState('');
  const my_email = window.sessionStorage.getItem('email');

  useEffect(() => {
    // Function to check application status
    const checkApplicationStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-application-approved', { email: my_email, user_role: 'courier' });
        const status = response.data.decision;
        if (status === 'approved') {
          // Application approved, render functionality
          navigate("/SeeOrders");
        } else if (status === 'declined') {
          // Application declined, alert the user
          alert('Your application has been declined.');
        } else {
          // Application still processing, set status
          setApplicationStatus('processing');
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    };

    // Initial call to check application status
    checkApplicationStatus();

    // Set interval to check application status every 5 seconds
    const interval = setInterval(() => {
      checkApplicationStatus();
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleSeeOrders = (event) => {
    event.preventDefault(); // Prevent the form submission
    navigate("/SeeOrders");
  };

  return (
    <div>
      <h1>Hello, welcome to CampusCuisine</h1>
      {applicationStatus === 'processing' ? (
        <p>Your application is currently being processed. Please wait for approval.</p>
      ) : (
        <form className="form" onSubmit={handleSeeOrders}>
          <div>
            <button className="sub-button-Home" type="submit">
              See available orders
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CourierHome;
