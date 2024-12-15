const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const productRoutes = require("./routes/productRoutes");

const app = express();
const port =process.env.PORT ||  4000;






const path= require('path');






// Middleware to parse JSON
app.use(bodyParser.json());

// Load environment variables
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.mongo_uri)
  .then(() => {
    console.log("Mongo Connected....");
  })
  .catch((error) => {
    console.error(error);
  });

// Import routes
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");

// Use routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);

// Home route
app.use('/home', (req, res) => {
  res.send("<h1>Welcome to Foody</h1>");
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});

app.use('/product',productRoutes);


app.use('/uploads',express.static('uploads'));

