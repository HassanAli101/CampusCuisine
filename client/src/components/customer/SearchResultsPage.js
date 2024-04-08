import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './../../styles/SearchResultsPage.css';

const SearchResultsPage = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('q');
    const searchResults = location.state.searchResults || [];
    const [newSearchQuery, setNewSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('itemName'); // Default sort by item name
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch additional data or perform other actions as needed
    }, []);

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/query", {     
                type: "food-search",
                query: newSearchQuery,
            }); 
    
            navigate(`/search`, { state: { searchResults: response.data } });
        } catch(error) {
            console.error("Error during search:", error.message);
        }
    };

    const handleSearchInputChange = (event) => {
        setNewSearchQuery(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleAddToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    const handleCheckout = async () => {
        try {
            // Send the selected items to the backend for checkout
            await axios.post("http://localhost:3001/ViewCart", {
                items: cartItems,
            });
            // Clear the cart after successful checkout
            setCartItems([]);
            alert("Items added to cart and sent for checkout!");
        } catch (error) {
            console.error("Error during checkout:", error.message);
            alert("Error during checkout. Please try again later.");
        }
    };

    // Sort the search results based on the selected option
    const sortedResults = [...searchResults].sort((a, b) => {
        if (sortBy === 'calories') {
            return a.calories - b.calories;
        } else if (sortBy === 'price') {
            return a.price - b.price;
        } else {
            // Default sorting by item name
            return a.itemName.localeCompare(b.itemName);
        }
    });

    return (
        <div className="search-results-page">
          <h1 className="search-results-title"></h1>
          <div className="search-sort-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search..."
                value={newSearchQuery}
                onChange={handleSearchInputChange}
                className="search-input"
              />
              <button type="submit" className="search-button">Search</button>
            </form>
            <div className="sort-by-container">
              <label htmlFor="sort" className="sort-label">Sort by:</label>
              <select id="sort" value={sortBy} onChange={handleSortChange} className="sort-select">
                <option value="itemName">Name</option>
                <option value="calories">Calories</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
          <p className="search-results-query"></p>
          <ul className="search-results-list">
            {sortedResults.map((result, index) => (
              <li key={index} className="search-results-item">
                <img src={result.image} alt={result.itemName} className="item-image" />
                <div>
                  <h2 className="item-name">{result.itemName}</h2>
                  <p className="vendor-email">Vendor Email: {result.vendorEmail}</p>
                  <p className="item-price">Price: {result.price}</p>
                  <p className="item-calories">Calories: {result.calories}</p>
                  <button onClick={() => handleAddToCart(result)} className="add-to-cart-button">Add to Cart</button>
                </div>
              </li>
            ))}
          </ul>
          {cartItems.length > 0 && (
            <div className="cart-container">
              <h2 className="cart-title">Cart</h2>
              <ul className="cart-list">
                {cartItems.map((item, index) => (
                  <li key={index} className="cart-item">{item.itemName}</li>
                ))}
              </ul>
              <button onClick={handleCheckout} className="checkout-button">Checkout</button>
            </div>
          )}
        </div>
      );     
};

export default SearchResultsPage;