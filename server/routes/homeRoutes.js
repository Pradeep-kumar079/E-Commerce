const express = require('express');
const {getAllProducts , getSingleProduct , getProductsByCategory} = require('../controller/homeController');
const router = express.Router();


// GET all products
router.get('/all-products', getAllProducts);

// GET single product
router.get('/all-products/:id', getSingleProduct);

// GET products by category
router.get('/products', getProductsByCategory);


module.exports = router;
