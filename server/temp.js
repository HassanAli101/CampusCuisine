import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import Users from "./models/userModel.js";
import studentVendors from "./models/studentVendorModel.js";
import Vendors from "./models/vendorModel.js";
import Customers from "./models/customerModel.js";
import Couriers from "./models/courierModel.js";
import CustomerReviews from "./models/CustomerReviewModel.js";
import { Router } from "express";
import Order from "./models/ordersModel.js";
import Items from "./models/itemModel.js";

import multer from "multer";

import jwt from 'jsonwebtoken';


dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
      console.log("Connected to Database");
    });
  })
  .catch((error) => {
    console.log(error);
  });

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

//Make your API calls for every usecase here
app.post("/upload", upload.single("image"), async (request, response) => {
  console.log("Post request received: ", request.body);

  if (
    request.body.type === "signup" &&
    request.body.usertype === "student_vendor"
  ) {
    console.log("Post malone");
    try {
      const {
        email,
        roll_Number,
        room_Number,
        hostel,
        name,
        phone_Number,
        password,
      } = request.body;

      const existingUser = await studentVendors.findOne({ name });

      if (existingUser) {
        console.log("username already exists. Cannot sign up.");
        response.send({ isAuthenticated: false });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new studentVendors({
          email,
          roll_Number,
          room_Number,
          hostel,
          name,
          phone_Number,
          password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log("User signed up:", savedUser);
        response.status(200).json({ isAuthenticated: true });
      }
    } catch (error) {
      console.error("Error signing up user:", error);
      response
        .status(500)
        .json({ isAuthenticated: false, error: "Internal server error." });
    }
  }

  //Make your API calls for every usecase here
  app.post("/", async (request, response) => {
    console.log("Post request received: ", request.body);

    if (
      request.body.type === "signup" &&
      request.body.usertype === "student_vendor"
    ) {
      signUpStudentVendor(request, response);
    }

    if (request.body.type === "signup" && request.body.usertype === "vendor") {
      console.log("signing up as vendor");
      try {
        const { email, name, phone_Number, password } = request.body;

        const existingUser = await Vendors.findOne({ email });

        if (existingUser) {
          console.log("email already exists. Cannot sign up.");
          response.send({ isAuthenticated: false });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = new Vendors({
            email,
            name,
            phone_Number,
            password: hashedPassword,
          });

          const savedUser = await newUser.save();

          //login table redirection code
          let role = "Vendor";
          const newUser2 = new Users({
            email,
            password: hashedPassword,
            role,
          });
          const savedUser2 = await newUser2.save();
          console.log("User signed up in vendor database:", savedUser);
          console.log("User data stored in users database", savedUser2);

          response.status(200).json({ isAuthenticated: true });
        }
      } catch (error) {
        console.error("Error signing up user:", error);
      }
    }

    if (request.body.type === "signup" && request.body.usertype === "courier") {
      console.log("Signing up as courier man");
      try {
        const { email, roll_Number, name, phone_Number, password } =
          request.body;

        const existingUser = await Couriers.findOne({ email });

        if (existingUser) {
          console.log("email already exists. Cannot sign up.");
          response.send({ isAuthenticated: false });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new Couriers({
            email,
            roll_Number,
            name,
            phone_Number,
            password: hashedPassword,
          });

          const savedUser = await newUser.save();
          //login table redirection code
          let role = "Courier";
          const newUser2 = new Users({
            email,
            password: hashedPassword,
            role,
          });
          const savedUser2 = await newUser2.save();
          console.log("User signed up in courier database:", savedUser);
          console.log("User data stored in users database", savedUser2);
          response.status(200).json({ isAuthenticated: true });
        }
      } catch (error) {
        console.error("Error signing up user:", error);
      }
    }

    if (
      request.body.type === "signup" &&
      request.body.usertype === "customer"
    ) {
      console.log("Signing up as customer");
      try {
        const {
          email,
          roll_Number,
          room_Number,
          hostel,
          name,
          phone_Number,
          password,
        } = request.body;

        const existingUser = await Customers.findOne({ email });

        if (existingUser) {
          console.log("email already exists. Cannot sign up.");
          response.send({ isAuthenticated: false });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = new Customers({
            email,
            roll_Number,
            room_Number,
            hostel,
            name,
            phone_Number,
            password: hashedPassword,
          });

          const savedUser = await newUser.save();
          //login table redirection code
          let role = "Customer";
          const newUser2 = new Users({
            email,
            password: hashedPassword,
            role,
          });
          const savedUser2 = await newUser2.save();
          console.log("User signed up in customer database:", savedUser);
          console.log("User data stored in users database", savedUser2);
          response.status(200).json({ isAuthenticated: true });
        }
      } catch (error) {
        console.error("Error signing up user:", error);
      }
    }

    if (request.body.type === "add_item") {
      console.log("adding item");
      try {
        const { itemName, category, stock, price, vendorEmail } = request.body;

        // Create a new item in the database
        const newItem = new Items({
          itemName,
          category,
          stock,
          price,
          image: request.file.buffer,
          vendorEmail,
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

    if (request.body.type === "login") {
      console.log("logging in");
      try {
        const { email, password } = request.body;

        const existingUser = await Users.findOne({ email });
        console.log(existingUser);

        if (!existingUser) {
          return response.status(404).json({ message: "User doesn't exist" });
        }

        bcrypt.compare(password, existingUser.password, function (err, result) {
          if (err) {
            return response
              .status(402)
              .json({ message: "Invalid credentials" });
          }
          if (result) {
            let role = existingUser.role;
            response.status(200).json({ message: role });
          }
        });

      } catch (error) {
        console.error("Error signing up user:", error);
      }
    }

    if (
      request.body.type === "review" &&
      request.body.usertype === "customer"
    ) {
      console.log("Review of customer received");
      try {
        const { vendor, rating, description } = request.body;

        const newReview = new CustomerReviews({
          vendor,
          rating,
          description,
        });
        const savedReview = await newReview.save();
        console.log("Review submitted:", savedReview);
        response.status(200).json({ isAuthenticated: true });
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  });

  // Create a new router instance
  const router = Router();

  // Define a route for food item search
  router.get("/food-search", async (request, response) => {
    const { q } = request.query;

    try {
      // Perform a text search for food items
      const results = await FoodItems.find({
        $text: { $search: q },
      });

      response.status(200).json(results);
    } catch (error) {
      console.error("Error searching for food items:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  });

  // Mount the router on the app
  app.use("/api", router);
});

// Admin endpoints

// // Fetch Vendor Reviews
// app.get("/api/admin/see-vendor-reviews", (req, res) => {
//   res.json([
//     { vendor: "Vendor 1", rating: 5, description: "Great service!" },
//     {
//       vendor: "Vendor 2",
//       rating: 4,
//       description: "Good, but room for improvement.",
//     },
//   ]);
// });

// // Fetch Vendor Requests
// app.get("/api/admin/see-vendor-requests", (req, res) => {
//   // Placeholder
//   res.json([{ vendorName: "New Vendor Request 1", requestDate: "2024-02-10" }]);
// });

// // Ban Vendors - Listing for now
// app.get("/api/admin/vendors", (req, res) => {
//   res.json([
//     { name: "Vendor 1", id: "v1" },
//     { name: "Vendor 2", id: "v2" },
//   ]);
// });

// // Fetch Courier Requests
// app.get("/api/admin/see-courier-requests", (req, res) => {
//   // Placeholder
//   res.json([
//     { courierName: "New Courier Request 1", requestDate: "2024-02-10" },
//     // Add more mock
//   ]);
// });

// app.get("/order", async (req, res) => {
//   try {
//     const orders = await Order.find();
//     res.json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
