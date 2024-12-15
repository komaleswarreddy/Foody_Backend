 // Import necessary modules
const express = require('express');
const vendorController = require('../controllers/vendorController');

// Create a new router instance
const router = express.Router();

// POST route to register a vendor
router.post('/register', vendorController.vendorRegister);

// POST route to login a vendor
router.post('/login', vendorController.vendorLogin);

// GET route to fetch all vendors
router.get('/all-vendors', vendorController.getAllVendors);

// GET route to fetch a single vendor by ID
router.get('/single-vendor/:apple', vendorController.getVendorById);

// Export the router
module.exports = router;
