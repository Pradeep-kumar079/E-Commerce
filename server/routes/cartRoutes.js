const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const verifyToken = require('../middleware/verifyToken');

// Add product to cart
router.post('/add-product', verifyToken, cartController.addToCart);

// Get cart items
router.get('/', verifyToken, cartController.getCart);

// Update cart item quantity
router.put('/update', verifyToken, cartController.updateQuantity);

// Remove product from cart
router.delete('/remove/:productId', verifyToken, cartController.removeFromCart);

module.exports = router;
