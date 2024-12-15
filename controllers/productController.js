const Product = require("../models/Product");
const Firm = require("../models/Firm");
const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// Multer middleware
const upload = multer({ storage: storage });

// Add Product
const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;

    // Check if the firm exists
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    // Create a new product
    const product = new Product({
      productName,
      price,
      category,
      bestseller,
      description,
      image,
      firm: firm._id,
    });

    // Save the product
    const savedProduct = await product.save();

    // Associate product with the firm
    firm.products.push(savedProduct);
    await firm.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Products by Firm
const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    // Check if the firm exists
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }



    const restaurant = firm.firmname;






    // Find all products associated with the firm
    const products = await Product.find({ firm: firmId });

    res.status(200).json({restaurant,products});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};









const deleteProductById= async(req,res)=>{
  const productId=req.params.productId;

  const deletedProduct = await Product.findByIdAndDelete(productId);


    if(!deleteProductById){
      return res.status(402).json("NO product found...");
    }
}



// Export routes
module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,
  deleteProductById
};
