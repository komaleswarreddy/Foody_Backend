const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.WhatIsYourName;  // Ensure this is the same secret used in vendorLogin

const verifyToken = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(400).json("Token is required.");
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey);

        // Find the vendor associated with the token
        const vendor = await Vendor.findById(decoded.vendorId);
        if (!vendor) {
            return res.status(402).json("Token is invalid. Vendor not found.");
        }

        // Attach vendor information to request
        req.vendorId = vendor._id;

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        res.status(400).json("Token is invalid.");
    }
};

module.exports = verifyToken;
