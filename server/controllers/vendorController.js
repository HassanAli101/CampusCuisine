//Shehbaz

import Items from "../models/itemModel.js";
import CustomerReviews from "../models/CustomerReviewModel.js";
import Order from "../models/ordersModel.js";
import Vendors from "../models/vendorModel.js";


const showitems = async (req, res) => {
  //Shehbaz
  // console.log(req.body);
  // console.log("Showing Items");
  try {
    let { vendorEmail } = req.body;
    // If email is null or undefined, assign a default value, Used during initial testing
    vendorEmail = vendorEmail || "default@email.com";
    console.log(vendorEmail);
    const items = await Items.find({ vendorEmail: vendorEmail });
    //console.log(items);
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
  
        //console.log("Item added successfully:", savedItem);
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
      //console.log(reviews);
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

    // Find the item_id with the least count
    let leastCountItemId = null;
    let leastCount = Infinity;
    itemCounts.forEach((count, itemId) => {
      if (count < leastCount) {
        leastCount = count;
        leastCountItemId = itemId;
      }
    });

    // Retrieve the item corresponding to the least count item_id
    const leastCountItem = await Items.findOne({ itemId: leastCountItemId });

    if (!leastCountItem) {
      return res.status(404).json({ error: 'No items found' });
    }

    // Respond with the item object of the item with the least count
    //console.log(leastCountItem)
    res.json({ leastCountItem });
  } catch (error) {
    console.error('Error retrieving orders:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const sellDataMostSold = async (req, res) => {
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

    // Find the item_id with the highest count
    let mostSoldItemId = null;
    let mostSoldCount = 0;
    itemCounts.forEach((count, itemId) => {
      if (count > mostSoldCount) {
        mostSoldCount = count;
        mostSoldItemId = itemId;
      }
    });

    // Retrieve the item corresponding to the highest count item_id
    const mostSoldItem = await Items.findOne({ itemId: mostSoldItemId });

    if (!mostSoldItem) {
      return res.status(404).json({ error: 'No items found' });
    }

    // Respond with the item object of the item with the highest count
    res.json({ mostSoldItem });
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
          status: { $in: ['New', 'InProgress'] }
      });
      //console.log(orders)
      // Extract itemIds from orders
      const itemIds = orders.map(order => order.item_id);
      
      // Find items matching the extracted itemIds
      const items = await Items.find({ itemId: { $in: itemIds } }).select('-_id');

      
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
    //console.log(orderCount)
    res.json({ totalOrders: orderCount });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const calculateTotalRevenue = async (req, res) => {
  const vendorEmail = req.body.vendorEmail;
  try {
    // Find orders for the given vendor email
    const orders = await Order.find({ vendorEmail });

    // Calculate total revenue by summing the total field of each order
    let totalRevenue = 0;
    orders.forEach(order => {
      totalRevenue += order.total;
    });
    //console.log(totalRevenue)

    res.json({ totalRevenue: totalRevenue });
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    throw error;
  }
};


const vendorItemGraphData = async (req, res) => {
  const vendorEmail = req.body.vendorEmail;
  //console.log("FEtching Data for Graph")
  try {
    
    

    // Aggregate to count occurrences of each item for the given vendor
    const itemCounts = await Order.aggregate([
      { $match: { vendorEmail } },
      { $group: { _id: '$item_id', count: { $sum: 1 } } },
    ]);

    // Fetch item details for each item
    const itemDetailsPromises = itemCounts.map(async (itemCount) => {
      const item = await Items.findOne({ itemId: itemCount._id });
      return {
        itemName: item.itemName,
        count: itemCount.count,
        price: item.price,
        total: itemCount.count * item.price,
      };
    });

    // Wait for all item details to be fetched
    const itemDetails = await Promise.all(itemDetailsPromises);

    // Send JSON response to client
    // console.log(itemDetails)
    res.json(itemDetails);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const fetchVendorOrderHistory = async (req,res) => {
  //console.log("HERE")
  const vendorEmail = req.body.vendorEmail;
  try {
      // Fetch orders for the specified vendor and sort by creation time (latest first)
      const orderHistory = await Order.find({ vendorEmail: vendorEmail }).sort({ createdAt: -1 });
      //console.log(orderHistory)
      res.json(orderHistory)
  } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
  }
};

const fetchVendorDetails = async (req,res) => {
  const email = req.body.vendorEmail;
  try {
    const vendor = await Vendors.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    console.log(vendor)
    res.json(vendor);
  } catch (err) {
    console.error('Error fetching vendor:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateVendorImage = async (req,res) => {
  console.log(req.body)
  try {
    const { email, imageLink } = req.body;
    const vendor = await Vendors.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Update profile image link in the database
    vendor.profileImage = imageLink;
    await vendor.save();
    console.log("SUCESS")
    res.status(200).json({ message: 'Profile image link updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const VendorUpdateInfo = async (req,res) => {
  console.log(req.body)
  const { vendorEmail,field, value} = req.body;
  try {
    const vendor = await Vendors.findOne({ email: vendorEmail });
    if (!vendor) {
      return res.status(404).json({ message: "vendor not found" });
    }
    vendor[field] = value;
    await vendor.save();
    res.status(200).json({ message: "vendor updated successfully" });
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  };


  export {showitems,add_item,ViewCustomerReviews,updateStockVendor,sellData,getNewOrders,
          vendorAnalytics,sellDataMostSold,calculateTotalRevenue,vendorItemGraphData,fetchVendorOrderHistory,
          fetchVendorDetails,updateVendorImage,VendorUpdateInfo};