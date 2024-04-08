// Page author: Hassan Ali
import "../../styles/CustomerReview.css";
// usestate to store the input values, learnt from: https://www.youtube.com/watch?v=5e9_hp0nh1Q
import { useState } from "react";
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

  const handleAddToCart = async (event) => {
    event.preventDefault();
    if (!vendor_email || !quantity || !item_name) { // check if all fields are filled
      alert("Please fill in all required fields.");
      return;
    }
    // retrieve the customer email from local storage
    const customer_email = window.localStorage.getItem('CustomerEmail');
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
    // using this variable to check against both student vendors and vendors (room for refactoring)
    let vendorFound = false;

    try {
      // get the student vendors from the server for cross validation
      const response = await axios.get('http://localhost:3001/studentvendors');
      if (response.status === 200) {
        console.log("vendors fetched!");
        const vendors = response.data;
        console.log("vendors", vendors);
        // find the vendor with the input email
        const vendor = vendors.find(vendor => vendor.email == vendor_email);
        console.log("vendor", vendor.email);
        console.log("vendor_email", vendor_email);
        console.log("found the single vendor: ", vendor);
        // if the vendor doesnt exist, then give warning accordingly
        if (!vendor) {
          alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
          return;
        } else {
          // if the vendor exists, then store the details in the variables
          vendorname = vendor.name;
          vendorhostel = vendor.hostel;
          vendorroom = vendor.room_Number;
          vendorFound = true;
        }
      } else {
        console.error('Failed to fetch student vendors:', await response.text());

      }
    } catch (error) {
      // alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
      console.error('Error fetching student vendors:', error.message);
      // return;
    }

    // if the vendor is not found in the student vendors, then check in the vendors
    if (vendorFound == false) {
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
      const response = await axios.post("http://localhost:3001/placeOrder", {
        vendor_email,
        customer_email,
        quantity,
        item_name,
        price,
        total,
        imglink,
        itemID,
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

    const customer_email = window.localStorage.getItem('CustomerEmail');
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
      const response = await axios.get('http://localhost:3001/studentvendors');
      if (response.status === 200) {
        console.log("vendors fetched!");
        const vendors = response.data;
        console.log("vendors", vendors);
        const vendor = vendors.find(vendor => vendor.email == vendor_email);
        console.log("vendor", vendor.email);
        console.log("vendor_email", vendor_email);
        console.log("found the single vendor: ", vendor);
        if (!vendor) {
          alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
          return;
        } else {
          vendorname = vendor.name;
          vendorhostel = vendor.hostel;
          vendorroom = vendor.room_Number;
          vendorFound = true;
        }
      } else {
        console.error('Failed to fetch student vendors:', await response.text());

      }
    } catch (error) {
      // alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
      console.error('Error fetching student vendors:', error.message);
      // return;
    }

    if (vendorFound == false) {
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

    const customer_email = window.localStorage.getItem('CustomerEmail');
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
      const response = await axios.get('http://localhost:3001/studentvendors');
      if (response.status === 200) {
        console.log("vendors fetched!");
        const vendors = response.data;
        console.log("vendors", vendors);
        const vendor = vendors.find(vendor => vendor.email == vendor_email);
        console.log("vendor", vendor.email);
        console.log("vendor_email", vendor_email);
        console.log("found the single vendor: ", vendor);
        if (!vendor) {
          alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
          return;
        } else {
          vendorname = vendor.name;
          vendorhostel = vendor.hostel;
          vendorroom = vendor.room_Number;
          vendorFound = true;
        }
      } else {
        console.error('Failed to fetch student vendors:', await response.text());

      }
    } catch (error) {
      // alert("Vendor doesnt exist, please reconfirm from \"view menu tab\".");
      console.error('Error fetching student vendors:', error.message);
      // return;
    }

    if (vendorFound == false) {
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
    <div className="review">
      <h1 >
        Place order
      </h1>
      <div className="partition"></div>
      <form className="form" onSubmit={handleAddToCart}>

        <div>
          <input
            className="user-inp"
            type="text"
            placeholder="Item Name"
            value={item_name}
            onChange={(e) => setitemname(e.target.value)}
          />
        </div>
        <div>
          <input
            className="user-inp"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div>
          <input
            className="user-inp"
            type="text"
            placeholder="Vendor Email"
            value={vendor_email}
            onChange={(e) => setVendor(e.target.value)}
          />
        </div>
        <div>
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