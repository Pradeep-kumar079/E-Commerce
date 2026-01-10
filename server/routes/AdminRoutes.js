const express = require("express");
const router = express.Router();
const { getProducts, getSingleProduct, addProduct, modifyProduct, deleteProduct , getAllOrders , getSingleOrder } = require("../controller/AdminController");
const upload = require("../middleware/upload");


//--------------------------------- these are all product routes access by admin.---------------------------------------//


// Get all products access by admin
router.get("/allproducts", getProducts);

// Get single product by ID
router.get("/product/:id", getSingleProduct);

// Add product (with multiple images)
router.post("/add-product", upload.array("images", 5), addProduct);

// Modify product (PUT request to match frontend)
router.put("/modify-product/:id", upload.array("images", 5), modifyProduct);

// Delete product
router.delete("/delete-product/:id", deleteProduct);


//--------------------------these are  all order routes access by admin.---------------------------------------//

// Get all orders access by admin
router.get('/all-orders', getAllOrders);

// Get single order by ID
router.get('/order/:id', getSingleOrder);
 

module.exports = router;
