 // Import necessary modules
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Configure environment variables
dotenv.config();

// Retrieve the JWT secret key from the environment
const secretKey = process.env.WhatIsYourName; 

// Vendor registration logic
const vendorRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email already exists
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("Email already exists");
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new vendor instance
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        // Save the new vendor to the database
        await newVendor.save();

        res.status(200).json("Registered Successfully");
        console.log("Vendor registered successfully");
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json("Server Error");
    }
};

// Vendor login logic with JWT token generation
const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the vendor by email
        const vendor = await Vendor.findOne({ email });

        // Check if the vendor exists and the password is correct
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json("Invalid Email or Password");
        }

        // Generate a JWT token
        const token = jwt.sign({ vendorId: vendor._id }, secretKey);

        res.status(200).json({
            message: "Login Successful",
            token: token, // Include the token in the response
        });
        console.log("Vendor logged in:", email);
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json("Server Error");
    }
};

// Fetch all vendors with populated 'firm' field
const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.status(200).json({ vendors });
    } catch (err) {
        console.error("Error fetching vendors:", err);
        res.status(500).json("Server Error");
    }
};

// Fetch a vendor by ID
const getVendorById = async (req, res) => {
    try {
        const vendorId = req.params.apple; // 'apple' is used as the parameter name

        // Find the vendor by ID
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json("Vendor not found");
        }

        res.status(200).json({ vendor });
    } catch (err) {
        console.error("Error fetching vendor by ID:", err);
        res.status(500).json("Server Error");
    }
};

// Export all controller functions
module.exports = { 
    vendorRegister, 
    vendorLogin, 
    getAllVendors, 
    getVendorById 
};
