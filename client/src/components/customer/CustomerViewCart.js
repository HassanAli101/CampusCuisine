import '../../styles/CustomerHome.css'
import { useState, useEffect } from "react";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerHome = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    const handleSelfPickup = async (event) => {
        let vendor_email = ""
        let quantity = 0
        let item_name = ""
        let numItems = 0;

        const customer_email = window.localStorage.getItem('CustomerEmail');
        console.log("customer_email", customer_email);
        const response = await axios.get('http://localhost:3001/CustomerCart');
        console.log("response", response);
        if (response.status === 200) {
            console.log("cart fetched!");
            const cart = response.data;
            console.log("cart", cart);
            const items = cart.filter(item => item.customer_email === customer_email);
            console.log("items", items);
            if (items.length === 0) {
                alert("Cart is empty, please add items to cart from \"view menu tab\".");
                return;
            } else {
                numItems = items.length;

            }
        } else {
            console.error('Failed to fetch cart:', await response.text());
        }


        for (let i = 0; i < numItems; i++) {
            vendor_email = items[i].vendor_email;
            quantity = items[i].quantity;
            item_name = items[i].item_name;
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
                const response = await axios.post("http://localhost:3001/selfpickupCart", {
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
    
    }

    const handledelivery = async (event) => {
        let vendor_email = ""
        let quantity = 0
        let item_name = ""
        let numItems = 0;
        

        const customer_email = window.localStorage.getItem('CustomerEmail');
        console.log("customer_email", customer_email);
        const response = await axios.get('http://localhost:3001/CustomerCart');
        console.log("response", response);
        if (response.status === 200) {
            console.log("cart fetched!");
            const cart = response.data;
            console.log("cart", cart);
            const items = cart.filter(item => item.customer_email === customer_email);
            console.log("items", items);
            if (items.length === 0) {
                alert("Cart is empty, please add items to cart from \"view menu tab\".");
                return;
            } else {
                numItems = items.length;
            }
        } else {
            console.error('Failed to fetch cart:', await response.text());
        }

        for (let i = 0; i < numItems; i++) {
            vendor_email = items[i].vendor_email;
            quantity = items[i].quantity;
            item_name = items[i].item_name;
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
                    console.log("vendor email has: ", vendor_email);
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
                //   console.log("price is: ", price)
                const response = await axios.post("http://localhost:3001/customerDeliveryCart", {
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
                    navigate('/CustomerHome');
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
    }


    useEffect(() => {
        const fetchItems = async () => {
            try {
                let customerEmail = localStorage.getItem('CustomerEmail');
                const response = await axios.post('http://localhost:3001/CustomerViewCart', { customerEmail });
                setItems(response.data);//Server returns items being sold by he vendor
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);


    return (
        <div className='maindiv'>
            <h3 className='title'>
                Your cart:
            </h3>
            <div className="items-container1">
                {items.map(item => (
                    <div key={item.itemId} className="item-card1">
                        <img src={item.image} alt={item.item_name} className="item-image1" />
                        <h6>{item.item_name}</h6>
                        <p>Vendor: {item.vendor_email}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {item.price}</p>
                        <p>Total: {item.total}</p>
                    </div>
                ))}
            </div>
            <div>
                <button className="sub-button" type="submit" onClick={handleSelfPickup}>
                    Self Pickup
                </button>
                <button className="sub-button" type="submit" onClick={handledelivery}>
                    Delivery
                </button>
            </div>
        </div>
    );

}

export default CustomerHome;