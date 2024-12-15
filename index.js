const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

// Routes
const productRoutes = require("./routes/productRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");

const app = express();
const port = process.env.PORT || 4000;

// Load environment variables
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.mongo_uri)
  .then(() => {
    console.log("Mongo Connected...");
  })
  .catch((error) => {
    console.error("Mongo Connection Error:", error);
  });

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Foody Backend</h1>");
});
app.use("/home", (req, res) => {
  res.send("<h1>Welcome to Foody</h1>");
});
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
