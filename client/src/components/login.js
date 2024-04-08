import '../styles/login.css'
import { useState } from "react";
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (prop)=>{
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const validEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      return emailRegex.test(email);
    }

    const handleLogin = async (event) => {
      event.preventDefault();
        // Validate user input including user role
        if (!email || !password) {
          alert("Please fill in all required fields.");
          return;
        }

        if (!validEmail(email))
        {
          alert("Please enter a valid email!");
          return;
        }

        try {
          const response = await axios.post("http://localhost:3001/", {     
          email,
          password,
          type: "login",
          usertype: "any",
        });

        console.log("My message: ", response.message)

          if (response.status === 200) {
            console.log("login successful!");
            console.log("response.data", response.data.message);
            window.localStorage.setItem('email') = email;

            // console.log("response.message", response.message);
            if (response.data.message === "Student_Vendor") {
              navigate('/StudentVendorHome');
            }
            else if (response.data.message === "Vendor") {
              navigate('/VendorHome');
              
            }
            else if (response.data.message === "Customer") {
              navigate('/CustomerHome');
              window.localStorage.setItem('email', email);
            }
            else if (response.data.message === "Courier") {
              navigate('/CourierHome');
              window.localStorage.setItem('email', email);
            }
            else if (response.data.message === "admin") {
              navigate('/AdminHome');
            }
            else {
              console.log("Login failed:", await response.text());
            }
          } else {
            console.error("Login failed:", await response.text());
          }
        } catch (error) {
          console.error("Error during login:", error.message);
        }
    };

    return (        
        <div className="login-page">
        <h1 className="login-header">
          CampusCousine
        </h1>
        <div className="partition"></div>
        <form className="form" onSubmit={handleLogin}>
          <div>
            <input
              className="user-inp"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className="pass-inp"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className="sub-button" type="submit">Login</button>
          </div>
        </form>
            <div className="question">Don't have an account? <a href="/MainSignup">Signup</a> </div>
        </div>
    )

}

export default Login

