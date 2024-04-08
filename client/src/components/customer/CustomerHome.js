import '../../styles/CustomerHome.css'
import { useState, useEffect } from "react";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerHome = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);

    const handlePlaceOrder = async (event) => {
    };

    const handleLeaveReview = async (event) => {
        navigate('/CustomerReview');
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/query", {
                type: "food-search",
                query: searchQuery,
            });

            navigate(`/search`, { state: { searchResults: response.data } });
        } catch (error) {
            console.error("Error during search:", error.message);
        }
    }

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.post('http://localhost:3001/CustomerTopVendors');
                setItems(response.data);//Server returns items being sold by he vendor
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);


    return (
        <div className='maindiv'>
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <button type="submit" className='SearchButton'>Search</button>
            </form>
            <h3 className='title'>
                Most Ordered from Vendors:
            </h3>
            <div className="items-container1">
                {items.map(item => (
                    <div key={item.itemId} className="item-card1">
                        <img src={item.image} alt={item.itemName} className="item-image1" />
                        <h6>{item.itemName}</h6>
                        <p>Category: {item.category}</p>
                    </div>
                ))}
            </div> 
            {/* <h3 className='title'>
                All of our Menu:
            </h3> */}
        </div>
    );

}

export default CustomerHome;