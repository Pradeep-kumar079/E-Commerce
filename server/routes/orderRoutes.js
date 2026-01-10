// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const verifyToken = require("../middleware/verifyToken");

// Create order (needs login)
router.post("/create", verifyToken, orderController.createOrder);

// Verify payment status
router.get("/verify-payment", orderController.verifyPayment);

module.exports = router;
