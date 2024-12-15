const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the folder where files will be saved
    cb(null, './uploads'); 
  },
  filename: function (req, file, cb) {
    // Define the file name
    cb(null, Date.now() + path.extname(file.originalname)); // Adds timestamp for unique filenames
  }
});



const upload  = multer({storage:storage});


const addFirm = async (req, res) => {
  try {
    // Destructure fields from request body
    const { firmname, area, category, region, offer } = req.body;

    // Handle the uploaded file (if any)
    const image = req.file ? req.file.filename : undefined;

    // Validate required fields
    if (!firmname || !area) {
      return res.status(400).json({
        message: "Missing required fields: firmname and area are required.",
      });
    }

    // Find the vendor by its ID (from the token)
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Create a new Firm instance
    const firm = new Firm({
      firmname,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    // Save the firm to the database
   const savedFirm =  await firm.save();


   vendor.firm.push(savedFirm);

    await vendor.save();





    // Send success response
    res.status(200).json({ message: "Firm Added Successfully" });
  } catch (error) {
    console.error("Error adding firm:", error);
    res.status(500).json({ message: "Error adding firm", error: error.message });
  }
};


const deleteFirmById= async(req,res)=>{
  const firmId=req.params.firmId;

  const deletedFirm = await Firm.findByIdAndDelete(firmId);


    if(!deleteFirmById){
      return res.status(402).json("NO Firm found...");
    }
}



module.exports = { addFirm:[upload.single('image'),addFirm],deleteFirmById};
