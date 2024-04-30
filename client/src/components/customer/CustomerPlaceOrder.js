// Page author: Hassan Ali
import "../../styles/CustomerPlaceOrder.css";
// usestate to store the input values, learnt from: https://www.youtube.com/watch?v=5e9_hp0nh1Q
import { useState, useEffect } from "react";
// axios to make get requests to the server, learnt from: https://www.youtube.com/watch?v=RQM5UyDrNDc
import axios from 'axios';
// use navigate to redirect to another page, learnt from: https://www.youtube.com/watch?v=162Lm52CTBM
import { useNavigate } from 'react-router-dom'

const CustomerPlaceOrder = (props) => {
  const navigate = useNavigate();
  // initializing input variables and their respective set functions using useState
  const [vendor_email, setVendor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [item_name, setitemname] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [vendorEmails, setVendorEmails] = useState([]);
  const [selectedVendorEmail, setSelectedVendorEmail] = useState("");
  const customer_email = window.sessionStorage.getItem('email');
  
  // useEffect(() => {
  //   fetchVendorEmails();
  // }, [item_name]);

  // *****GET VENDOR EMAILS*************
  const fetchVendorEmails = async (itemName) => {
    try {
      const response = await axios.post(`http://localhost:3001/get-vendor-emails-for-customer-place-order`, {
        query: itemName
      });
      setVendorEmails(response.data.map(vendor => vendor));
      console.log("vendors: ", vendorEmails)
    } catch (error) {
      console.error("Error fetching vendor emails:", error.message);
    }
  };

  const handleVendorSelect = (e) => {
    setSelectedVendorEmail(e.target.value);
    setVendor(e.target.value) // maintain Hasan's code
  }

  // ************************************

  const handleInputChange = (e) => { // do pattern matching and get the specific items which match pattern
    console.log("Inside handle: ", e.target.value)
    setitemname(e.target.value); // Update item_name state
    handleSearch(e.target.value); // Trigger search functionality
    fetchVendorEmails(e.target.value);
  };

  const handleSearchClick = (item) => { // if customer clicks on one of the searches that pop-up, make these searches disappear
    console.log("Inside handle: ", item)
    setitemname(item); // Update item_name state
    setSearchResults([]);
    fetchVendorEmails(item);
  }

  const handleSearch = async (itemName) => {
    try {
      console.log("Item name inside search: ", itemName)
      const response = await axios.post(`http://localhost:3001/items-for-search`, {
        query: itemName,
      });

      setSearchResults(response.data);

    } catch (error) {
      console.error("Error searching for items:", error.message);
    }
  };

  const handleAddToCart = async (event) => {
    event.preventDefault();

    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }
    if (!vendor_email || !quantity || !item_name) { // check if all fields are filled
      alert("Please fill in all required fields.");
      return;
    }
    // retrieve the customer email from local storage
    // const customer_email = window.localStorage.getItem('CustomerEmail');
    console.log("customer_email", customer_email);
    // initialize variables to store the vendor and customer details (from databases cuz we are good coders and dont ask for same things twice :p)
    let vendorname = "";
    let vendorhostel = "";
    let vendorroom = "";
    let customerhostel = "";
    let customerroom = "";
    let customername = "";
    let imglink = "";
    let price;
    let itemID;
    let itemQuantity;
    let vendorFound = false;

    try {
      const response = await axios.get('http://localhost:3001/vendors');
      if (response.status === 200) {
        console.log("vendors fetched!");
        const vendors = response.data;
        console.log("vendors", vendors);
        const vendor = vendors.find(vendor => vendor.email === vendor_email);
        console.log("found the single vendor: ", vendor);
        if (!vendor) {
          alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
          return;
        } else {
          vendorname = vendor.name;
          vendorhostel = "LUMS";
          vendorroom = "LUMS";
          vendorFound = true;
        }
      } else {
        console.error('Failed to fetch vendors:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching vendors:', error.message);
    }


    // if the vendor is not found in the vendors, then give the warning accordingly
    if (vendorFound == false) {
      alert("Vendor doesnt exist, please reconfirm from \"Home page\".");
      return;
    }


    // get the customer details from the database
    try {
      const response = await axios.get('http://localhost:3001/customers');
      if (response.status === 200) {
        console.log("customers fetched!");
        const customers = response.data;
        console.log("customers", customers);
        const customer = customers.find(customer => customer.email === customer_email);
        console.log("found the single customer: ", customer);
        if (!customer) {
          alert("Customer doesnt exist, please reconfirm from \"hopefuly this never appears\".");
          return;
        } else {
          customername = customer.name;
          customerhostel = customer.hostel;
          customerroom = customer.room_Number;
        }
      } else {
        console.error('Failed to fetch customers:', await response.text());
      }
    }
    catch (error) {
      console.error('Error fetching customers:', error.message);
    }

    // get the item details from the database
    try {
      const response = await axios.get('http://localhost:3001/items');
      if (response.status === 200) {
        console.log("items fetched!");
        const items = response.data;
        console.log("items", items);
        //cross validate the item with the vendor email
        const item = items.find(item => item.itemName == item_name && item.vendorEmail == vendor_email);
        console.log("found the single item: ", item);
        console.log("item_name", item_name);
        console.log("item", item);
        if (!item) {
          alert("Item doesnt exist or item not sold by vendor, please reconfirm from \"view menu tab\".");
          return;
        } else {
          price = item.price;
          imglink = item.image;
          itemID = item.itemId;
          itemQuantity = item.stock;

        }
      } else {
        console.error('Failed to fetch items:', await response.text());
      }
    }
    catch (error) {
      console.error('Error fetching items:', error.message);
    }
    if (quantity > itemQuantity) {
      alert("Quantity exceeds the available stock, please reconfirm from \"view menu tab\".");
      return;
    }
    let total = price * quantity;
    try {
      const itemId = itemID
      const response = await axios.post("http://localhost:3001/placeOrder", {
        vendor_email,
        customer_email,
        quantity,
        item_name,
        price,
        total,
        imglink,
        itemId,
        stock: itemQuantity,
        type: "placeOrder",
        usertype: "customer",
      });
      if (response.status === 200) {
        // if successful, log the order and redirect to customer home
        console.log("order logged!");
        
      } else {
        console.error("order log failed:", await response.text());
      }
    } catch (error) {
      console.error("error logging order::", error.message);
    }
    try {
      const response = await axios.post("http://localhost:3001/UpdateQuantity", {
        itemId: itemID,
        vendorEmail: vendor_email,
        quantity: itemQuantity - quantity,
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
  };

  // similar principles, this directly places order in orders table and courier can see it on their new orders page
  const handleSelfPickup = async (event) => {
    event.preventDefault();
    if (!vendor_email || !quantity || !item_name) {
      alert("Please fill in all required fields.");
      return;
    }

    // const customer_email = window.localStorage.getItem('CustomerEmail');
    console.log("customer_email", customer_email);
    let vendorname = "";
    let vendorhostel = "";
    let vendorroom = "";
    let customerhostel = "";
    let customerroom = "";
    let customername = "";
    let price;
    let vendorFound = false;
    let itemId;
    let itemQuantity;

    try {
      const response = await axios.get('http://localhost:3001/vendors');
      if (response.status === 200) {
        console.log("vendors fetched!");
        const vendors = response.data;
        console.log("vendors", vendors);
        const vendor = vendors.find(vendor => vendor.email === vendor_email);
        console.log("found the single vendor: ", vendor);
        if (!vendor) {
          alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
          return;
        } else {
          vendorname = vendor.name;
          vendorhostel = "LUMS";
          vendorroom = "LUMS";
          vendorFound = true;
        }
      } else {
        console.error('Failed to fetch vendors:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching vendors:', error.message);
    }

    if (vendorFound == false) {
      alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/customers');
      if (response.status === 200) {
        console.log("customers fetched!");
        const customers = response.data;
        console.log("customers", customers);
        const customer = customers.find(customer => customer.email === customer_email);
        console.log("found the single customer: ", customer);
        if (!customer) {
          alert("Customer doesnt exist, please reconfirm from \"view menu tab\".");
          return;
        } else {
          customername = customer.name;
          customerhostel = customer.hostel;
          customerroom = customer.room_Number;
        }
      } else {
        console.error('Failed to fetch customers:', await response.text());
      }
    }
    catch (error) {
      console.error('Error fetching customers:', error.message);
    }

    try {
      const response = await axios.get('http://localhost:3001/items');
      if (response.status === 200) {
        console.log("items fetched!");
        const items = response.data;
        console.log("items", items);
        const item = items.find(item => item.itemName == item_name && item.vendorEmail == vendor_email);
        console.log("found the single item: ", item);
        console.log("item_name", item_name);
        console.log("item", item);
        if (!item) {
          alert("Item doesnt exist or item not sold by vendor, please reconfirm from \"view menu tab\".");
          return;
        } else {
          price = item.price;
          itemId = item.itemId;
          itemQuantity = item.stock;
        }
      }
      else {
        console.error('Failed to fetch items:', await response.text());
      }
    }
    catch (error) {
      console.error('Error fetching items:', error.message);
    }
    console.log("itemQuantity: ", itemQuantity);
    console.log("quantity: ", quantity);
    if (quantity > itemQuantity) {
      alert("Quantity exceeds the available stock, please reconfirm from \"view menu tab\".");
      return;
    }
    let total = price * quantity;
    let clientAddr = customerroom + ", " + customerhostel;
    let vendorAddr = vendorroom + ", " + vendorhostel;
    try {
      console.log("price is: ", price)
      const response = await axios.post("http://localhost:3001/selfpickup", {
        vendor_email,
        vendorname,
        customer_email,
        customername,
        quantity,
        item_name,
        clientAddr,
        vendorAddr,
        price,
        total,
        status: "New",
        itemId,
        type: "selfpickup",
        usertype: "customer",
      });
      if (response.status === 200) {
        console.log("order logged!");
        // navigate('/CustomerHome');
      } else {
        console.error("order log failed:", await response.text());
      }
    }
    catch (error) {
      console.error("error logging order::", error.message);
    }
    try {
      const response = await axios.post("http://localhost:3001/UpdateQuantity", {
        itemId,
        vendorEmail: vendor_email,
        quantity: itemQuantity - quantity,
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

  const handledelivery = async (event) => {
    event.preventDefault();
    if (!vendor_email || !quantity || !item_name) {
      alert("Please fill in all required fields.");
      return;
    }

    // const customer_email = window.localStorage.getItem('CustomerEmail');
    console.log("customer_email", customer_email);
    let vendorname = "";
    let vendorhostel = "";
    let vendorroom = "";
    let customerhostel = "";
    let customerroom = "";
    let customername = "";
    let price;
    let vendorFound = false;
    let itemId;
    let itemQuantity;

    try {
      const response = await axios.get('http://localhost:3001/vendors');
      if (response.status === 200) {
        console.log("vendors fetched!");
        const vendors = response.data;
        console.log("vendors", vendors);
        const vendor = vendors.find(vendor => vendor.email === vendor_email);
        console.log("found the single vendor: ", vendor);
        if (!vendor) {
          alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
          return;
        } else {
          vendorname = vendor.name;
          vendorhostel = "LUMS";
          vendorroom = "LUMS";
          vendorFound = true;
        }
      } else {
        console.error('Failed to fetch vendors:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching vendors:', error.message);
    }

    if (vendorFound == false) {
      alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/customers');
      if (response.status === 200) {
        console.log("customers fetched!");
        const customers = response.data;
        console.log("customers", customers);
        const customer = customers.find(customer => customer.email === customer_email);
        console.log("found the single customer: ", customer);
        if (!customer) {
          alert("Customer doesnt exist, please reconfirm from \"view menu tab\".");
          return;
        } else {
          customername = customer.name;
          customerhostel = customer.hostel;
          customerroom = customer.room_Number;
        }
      } else {
        console.error('Failed to fetch customers:', await response.text());
      }
    }
    catch (error) {
      console.error('Error fetching customers:', error.message);
    }

    try {
      const response = await axios.get('http://localhost:3001/items');
      if (response.status === 200) {
        console.log("items fetched!");
        const items = response.data;
        console.log("items", items);
        const item = items.find(item => item.itemName == item_name && item.vendorEmail == vendor_email);
        console.log("found the single item: ", item);
        console.log("item_name", item_name);
        console.log("item", item);
        if (!item) {
          alert("Item doesnt exist or item not sold by vendor, please reconfirm from \"view menu tab\".");
          return;
        } else {
          price = item.price;
          itemId = item.itemId;
          itemQuantity = item.stock;
        }
      }
      else {
        console.error('Failed to fetch items:', await response.text());
      }
    }
    catch (error) {
      console.error('Error fetching items:', error.message);
    }
    console.log("itemQuantity: ", itemQuantity);
    console.log("quantity: ", quantity);
    if (quantity > itemQuantity) {
      alert("Quantity exceeds the available stock, please reconfirm from \"view menu tab\".");
      return;
    }
    let total = price * quantity;
    let clientAddr = customerroom + ", " + customerhostel;
    let vendorAddr = vendorroom + ", " + vendorhostel;
    try {
      console.log("price is: ", price)
      const response = await axios.post("http://localhost:3001/customerDelivery", {
        vendor_email,
        vendorname,
        customer_email,
        customername,
        quantity,
        item_name,
        clientAddr,
        vendorAddr,
        price,
        total,
        status: "New",
        itemId,
        type: "delivery",
        usertype: "customer",
      });
      if (response.status === 200) {
        console.log("order logged!");
        // navigate('/CustomerHome');
      } else {
        console.error("order log failed:", await response.text());
      }
    }
    catch (error) {
      console.error("error logging order::", error.message);
    }
    try {
      const response = await axios.post("http://localhost:3001/UpdateQuantity", {
        itemId,
        vendorEmail: vendor_email,
        quantity: itemQuantity - quantity,
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



  return (
    <div className='maindiv'>
      <h1 >
        Place order
      </h1>
      <form className="form" onSubmit={handleAddToCart}>
          <input
            className="user-inpCPO"
            type="textarea"
            placeholder="Item Name"
            value={item_name}
            onChange={handleInputChange}
          />
       
        {/* Render search results */}
        <div className="search-results1">
          {searchResults.map((item) => (
            <div className="search-results-item" key={item.itemId}>
              <p onClick={() => handleSearchClick(item.itemName)}>{item.itemName}</p>
              {/* Render other item details */}
            </div>
          ))}
        </div>
        <div>
          <input
            className="user-inpCPO"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div>
          <select className="user-inpCPO" onChange={handleVendorSelect}>
            <option value="">Select Vendor</option>
            {vendorEmails.map((vendor) => (
              <option key={vendor} value={vendor} className="vendor-render">
                {vendor}
              </option>
            ))}
          </select>
        </div>
        <div className="ButtonsCPO">
          <button className="sub-button" type="submit" onClick={handleAddToCart}>
            Add To Cart
          </button>
          <button className="sub-button" type="submit" onClick={handleSelfPickup}>
            Self Pickup
          </button>
          <button className="sub-button" type="submit" onClick={handledelivery}>
            Delivery
          </button>
        </div>
      </form>
      <div className="question">
        Go back to <a href="/CustomerHome">Home</a>
      </div>
    </div>
  );
};

export default CustomerPlaceOrder;