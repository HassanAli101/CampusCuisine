import "../../styles/CustomerUpdateInfo.css";
// usestate to store the input values, learnt from: https://www.youtube.com/watch?v=5e9_hp0nh1Q
import { useState } from "react";
// axios to make get requests to the server, learnt from: https://www.youtube.com/watch?v=RQM5UyDrNDc
import axios from 'axios';
// use navigate to redirect to another page, learnt from: https://www.youtube.com/watch?v=162Lm52CTBM
import { useNavigate } from 'react-router-dom'

const CustomerUpdateInfo = (props) => {
    const navigate = useNavigate();
    // initializing input variables and their respective set functions using useState
    const [field, setField] = useState("");
    const [value, setValue] = useState("");

    // asynchronous function to handle the review submission
    const handleUpdateInfo = async (event) => {
        event.preventDefault();
        console.log("field", field);
        console.log("value", value);
        if (!field || !value) { // check if all fields are filled
            alert("Please fill in all required fields.");
            return;
        }

        // get the customer email from local storage, learnt from https://www.youtube.com/watch?v=A98SPz5XLwY
        const customer_email = window.sessionStorage.getItem('email');
        console.log("customer_email", customer_email);

        try {
            const response = await axios.post("http://localhost:3001/CustomerUpdateInfo", {
                field,
                value,
                customer_email,
                type: "review",
                usertype: "customer",
            });

            if (response.status === 200) {
                // if successsful, log the review and redirect to customer home
                console.log("update info logged!");
                navigate('/CustomerHome');
            } else {
                console.error("update log failed:", await response.text());
            }
        } catch (error) {
            console.error("error logging update:", error.message);
        }
    };

    const handleLogOut = () => {
        window.sessionStorage.clear();
        navigate('/');
    }




    return (
        // most of this code is from the skeleton one uploaded in the DB course, however, i'll just walk through some of the changes i made
        // using onsubmit to call handlereview when form submitted (i.e when the submit button is clicked)
        //using onchange to call the respective set function when the input value changes
        // using validate rating to ensure the rating is not greater than 5
        <div className='maindiv'>
            <h1>
                Update your personal info
            </h1>
            <form className="form" onSubmit={handleUpdateInfo}>
                <select class="user-inpCPO" onChange={(e) => setField(e.target.value)}>
                    <option value="">What to change?</option>
                    <option value="room_Number">Room Number</option>
                    <option value="hostel">Hostel</option>
                    <option value="phone_Number">Phone Number</option>
                </select>
                <input
                    type="textarea"
                    placeholder="Enter new value"
                    className="user-inpCPO"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <button className="sub-button" type="submit">
                    Update Info
                </button>
                <button className="sub-button" onClick={handleLogOut}>Log out</button>
            </form>
        </div>
    );
};

export default CustomerUpdateInfo;