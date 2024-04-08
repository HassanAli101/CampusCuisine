//Shehbaz

import Items from "../models/itemModel.js";
import CustomerReviews from "../models/CustomerReviewModel.js";
import Order from "../models/ordersModel.js";


const showitems = async (req, res) => {
  //Shehbaz
  console.log(req.body);
  console.log("Showing Items");
  try {
    let { vendorEmail } = req.body;
    // If email is null or undefined, assign a default value, Used during initial testing
    vendorEmail = vendorEmail || "default@email.com";
    console.log(vendorEmail);
    const items = await Items.find({ vendorEmail: vendorEmail });
    console.log(items);
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);

    res.status(500).json({ error: "Server error" });
  }
};

const add_item = async (request, response) => {
    //Shehbaz
    if (request.body.type === "add_item") {
      console.log("adding item");
      try {
        let { itemName, category, stock, price, image, vendorEmail, calories } =
          request.body;
        vendorEmail = vendorEmail || "default@email.com";
  
      // Find the maximum itemId in the database
      //Item ID was chosen to be auto incrementing
      const maxItemId = await Items.findOne({}, { itemId: 1 }, { sort: { itemId: -1 } });
  
        let nextItemId = 1;
        if (maxItemId) {
          nextItemId = maxItemId.itemId + 1;
        }
  
        // Create a new item in the database
        const newItem = new Items({
          itemId: nextItemId,
          itemName,
          category,
          stock,
          price,
          image,
          vendorEmail,
          calories,
        });
  
        const savedItem = await newItem.save();
  
        console.log("Item added successfully:", savedItem);
        response.status(200).json({ message: "Item added successfully" });
      } catch (error) {
        console.error("Error adding item:", error);
        response
          .status(500)
          .json({ message: "Failed to add item. Please try again." });
      }
    }
  };
  


const ViewCustomerReviews = async (req, res) => {
    //Shehbaz
    //Simpy check and fetch query from our DB
    console.log("Fetching vendor reviews")
    const vendorEmail = req.body.vendorEmail
    console.log(vendorEmail)
  
    try {
      const reviews = await CustomerReviews.find({ vendor_email: vendorEmail });
      console.log(reviews);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const updateStockVendor = async (req,res) =>{
  console.log("Updating stock")
  console.log(req.body)
  let {itemId,newStock}=req.body;
  try {
    const item = await Items.findOneAndUpdate(
        { itemId: itemId }, // Filter to find the item by its ID
        { $set: { stock: newStock } }, // Update the stock field
        { new: true } // Return the modified document
    );

    if (!item) {
        throw new Error('Item not found');
    }

    return item;
} catch (error) {
    // Handle errors
    console.error('Error updating stock:', error);
    throw error;
}
};



const sellData = async (req, res) => {
  try {
    const vendorEmail = req.body.vendorEmail;
    const orders = await Order.find({ vendorEmail });

    // Create a map to store item_id counts
    const itemCounts = new Map();

    orders.forEach(order => {
      const { item_id } = order;
      if (itemCounts.has(item_id)) {
        itemCounts.set(item_id, itemCounts.get(item_id) + 1);
      } else {
        itemCounts.set(item_id, 1);
      }
    });

    // Convert map to object for easier JSON response
    const itemCountsObject = {};
    itemCounts.forEach((value, key) => {
      itemCountsObject[key] = value;
    });

    console.log(itemCounts)

    res.json({
      orders: orders.map(order => ({ item_id: order.item_id })),
      itemCounts: itemCountsObject
    });
  } catch (error) {
    console.error('Error retrieving orders:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getNewOrders = async (req, res) => {
  console.log("HERE");
  try {
      let vendorEmail = req.body.vendorEmail;
      // Get all orders matching vendor email and not delivered
      const orders = await Order.find({
          vendorEmail: vendorEmail,
          status: { $ne: 'Delivered' }
      });
      
      // Extract itemIds from orders
      const itemIds = orders.map(order => order.item_id);
      
      // Find items matching the extracted itemIds
      const items = await Items.find({ itemId: { $in: itemIds } });
      
      // Join orders and items where vendor email matches
      const joinedData = orders.map(order => {
        const matchingItem = items.find(item => item.itemId === order.item_id);
        if (matchingItem) {
          return { ...order.toObject(), ...matchingItem.toObject() };
        }
        return null; // If no match found
      }).filter(item => item !== null);
      
      console.log(joinedData);
      res.json(joinedData);

  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}


const vendorAnalytics = async (req, res) => {
  try {
    
    const vendorEmail = req.body.vendorEmail;
    console.log(vendorEmail)

    // Count the number of orders for the given vendor email
    const orderCount = await Order.countDocuments({ vendorEmail });
    console.log(orderCount)
    res.json({ totalOrders: orderCount });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

  export {showitems,add_item,ViewCustomerReviews,updateStockVendor,sellData,getNewOrders,vendorAnalytics};