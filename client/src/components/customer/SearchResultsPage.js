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
      // Load cart information from sessionStorage when the component mounts
      const savedCartItems = JSON.parse(sessionStorage.getItem('cartItems'));
      if (savedCartItems) {
          setCartItems(savedCartItems);
      }
    }, []);

    const updateCartItems = (updatedCartItems) => {
        // Update cart items state and also save it to sessionStorage
        setCartItems(updatedCartItems);
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/query", {     
                type: "food-search",
                query: newSearchQuery,
                // vendor email,customer email,quantity,item_name, // itemId,// item_id,// price,total,imglink,
       
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
      // Check if the item is already in the cart
      const existingItemIndex = cartItems.findIndex(cartItem => cartItem.itemId === item.itemId);
      console.log("Item: ", item.itemName, " with item id: ", item.itemId)
      if (existingItemIndex !== -1) {
          // If the item already exists in the cart, update its quantity
          const updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += 1;
          updateCartItems(updatedCartItems);
      } else {
          // If the item is not in the cart, add it with quantity 1
          updateCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    };
    
    const handleRemoveFromCart = (itemId) => {
      // Remove item from cartItems
      const updatedCartItems = cartItems.filter(item => item.itemId !== itemId);
      updateCartItems(updatedCartItems);
    };

    const handleIncreaseQuantity = (itemId) => {
      const updatedCartItems = cartItems.map(item => {
          if (item.itemId === itemId) {
              return { ...item, quantity: item.quantity + 1 };
          }
          return item;
      });
      updateCartItems(updatedCartItems);
    };

    const handleDecreaseQuantity = (itemId) => {
      const updatedCartItems = cartItems.map(item => {
          if (item.itemId === itemId && item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
          }
          return item;
      });
      updateCartItems(updatedCartItems.filter(item => item.quantity > 0));
    };

    const handleCheckout = async () => {
        try {
            // Send the selected items to the backend for checkout
            for (let item of cartItems){
              if (item.quantity > item.stock){
                alert("Quantity selected for ", item.itemName," exceeds the available stock!")
                return
              }
              const total = item.quantity * item.price
              const customerEmail = window.sessionStorage.getItem('email');
              try{
                    await axios.post("http://localhost:3001/placeOrder", {
                    type: "placeOrder",
                    usertype: "customer",
                    vendor_email: item.vendorEmail,
                    customer_email: customerEmail,
                    quantity: item.quantity,
                    item_name: item.itemName,
                    itemID: item.itemId,
                    price: item.price,
                    total: total,
                    imglink: item.image,
                    stock: item.stock
                });
              } catch(err){
                console.log("Error while adding to cart from frontend: ", err)
              }
              try {
                const response = await axios.post("http://localhost:3001/UpdateQuantity", {
                  itemId: item.itemID,
                  vendorEmail: item.vendorEmail,
                  quantity: item.stock-item.quantity,
                });
                if (response.status === 200) {
                  console.log("item quantity updated!");
                  navigate('/CustomerHome');
                } else {
                  console.error("item quantity update failed:", await response.text());
                }
              } catch (error) {
                console.error("error updating item quantity::", error.message);
              }
            }
            
            // Clear the cart after successful checkout
            setCartItems([]);
            alert("Added to cart!");
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
              type="textarea"
              placeholder="Search..."
              value={newSearchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
          <div className="sort-by-container">
          <label htmlFor="sort" className="sort-label" style={{ fontFamily: 'Arial, sans-serif', color: '#fff', fontSize: '16px', marginRight: '10px' }}>Sort by:</label>
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
            <h2 className="cart-title" style={{ fontFamily: 'Arial, sans-serif', color: '#fff' }}>Cart</h2>
            <ul className="cart-list">
                  {cartItems.map((item, index) => (
                    <li key={index} className="cart-item">
                        <div className="cart-item-details" >
                            <div>
                                <h3 style={{ fontFamily: 'Arial, sans-serif', color: '#fff' }}>{item.itemName}</h3>
                                <p style={{ fontFamily: 'Arial, sans-serif', color: '#fff' }}>Price: {item.price}</p>
                                <p style={{ fontFamily: 'Arial, sans-serif', color: '#fff' }}>Quantity: {item.quantity}</p>
                                <p style={{ fontFamily: 'Arial, sans-serif', color: '#fff' }}>Total: {item.price * item.quantity}</p>
                            </div>
                            <div className="cart-item-actions">
                            <button onClick={() => handleIncreaseQuantity(item.itemId)} className="cart-action-button" >+</button>
<button onClick={() => handleDecreaseQuantity(item.itemId)} className="cart-action-button" >-</button>
<button onClick={() => handleRemoveFromCart(item.itemId)} className="cart-action-button" >Remove</button>


                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={handleCheckout} className="checkout-button" >Checkout</button>
          </div>
        )}
      </div>
    );    
};

export default SearchResultsPage;
