import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

// Import models
import Users from "./models/userModel.js";
import studentVendors from "./models/studentVendorModel.js";
import Vendors from "./models/vendorModel.js";
import Customers from "./models/customerModel.js";
import Couriers from "./models/courierModel.js";
import Admins from "./models/adminModel.js";

import CustomerReviews from "./models/CustomerReviewModel.js";
import { Router } from "express";
import Order from "./models/ordersModel.js";
import Items from "./models/itemModel.js";

// Create a new Admins instance
const hashedPassword = await bcrypt.hash('123', 10);
const newAdmin = new Admins({
    email: 'admin@lums.edu.pk', // Set the email
    password: hashedPassword,   // Set the password
});

const newUser = new Users({
  email: 'admin@lums.edu.pk',
  password: hashedPassword,
  role: 'admin'
})

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONG_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Save the newAdmin instance to the database
newAdmin.save()
    .then(savedAdmin => {
        console.log('Admin saved successfully:', savedAdmin);
    })
    .catch(error => {
        console.error('Error saving admin:', error);
    });

newUser.save()
.then(savedAdmin => {
    console.log('Admin saved successfully:', savedAdmin);
})
.catch(error => {
    console.error('Error saving admin:', error);
});
