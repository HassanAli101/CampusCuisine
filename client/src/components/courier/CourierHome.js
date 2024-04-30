import "../../styles/CustomerHome.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CourierHome = () => {
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState('');
  const my_email = window.localStorage.getItem('CourierEmail');

  useEffect(() => {
    // Function to check application status
    const checkApplicationStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3001/is-application-approved', { email: my_email, user_role: 'courier' });
        const status = response.data.decision;
        console.log('Application status:', response.data.decision);
        if (status === 'approve') {
          // Application approved, render functionality

          navigate("/SeeOrders");
        } else if (status === 'decline') {
          // Application declined, alert the user
          // alert('Your application has been declined.');
          window.sessionStorage.setItem("application", "decline");
          setApplicationStatus('decline');
        } else {
          // Application still processing, set status
          window.sessionStorage.setItem("application", "processing");

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
  }, [my_email, navigate]);
  

  return (
    <div>
  {applicationStatus === 'processing' ? (
    <h3 className='title'>
      Your application is currently being processed. Please wait for approval
    </h3>      
  ) : applicationStatus === 'decline' ? (
    <h3 className='title'>
      Application has been rejected
    </h3>
  ) : (
    <p>Application status: {applicationStatus}</p>
  )}
</div>

  );
};

export default CourierHome;
