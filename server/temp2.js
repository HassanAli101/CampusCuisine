import mongoose from "mongoose";
import dotenv from "dotenv";

// Import models
import Items from "./models/itemModel.js";
import Vendors from "./models/vendorModel.js";
import Carts from "./models/cartsModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONG_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");

    try {
      // Find all distinct vendor_email values from the Vendors table
      const validVendorEmails = await Vendors.distinct("email");

      // Delete entries from the carts table where vendor_email field is not in validVendorEmails
      const cartsDeletedCount = await Carts.deleteMany({
        vendor_email: { $nin: validVendorEmails },
      });

      console.log(`${cartsDeletedCount.deletedCount} entries deleted from carts`);

      // Find all distinct vendorEmail values from the Vendors table
      const validVendorIds = await Vendors.distinct("vendorId");

      // Delete entries from the items table where vendorId field is not in validVendorIds
      const itemsDeletedCount = await Items.deleteMany({
        vendorId: { $nin: validVendorIds },
      });

      console.log(`${itemsDeletedCount.deletedCount} entries deleted from items`);
    } catch (error) {
      console.error("Error deleting entries:", error);
    }

    mongoose.connection.close();
  })
  .catch((err) => console.error(err));
