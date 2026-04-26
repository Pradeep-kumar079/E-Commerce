// routes/orderRoutes.js

const express = require("express");
const router = express.Router();

const orderController = require("../controller/orderController");
const verifyToken = require("../middleware/verifyToken");

/* =================================
   CREATE ORDER
================================= */

// Create order (login required)
router.post(
  "/create",
  verifyToken,
  orderController.createOrder
);

/* =================================
   ORDER STATUS
   (Renamed from verify-payment)
================================= */

// OLD:
// router.get("/verify-payment", orderController.verifyPayment);

// NEW:
router.get(
  "/order-status",
  orderController.verifyPayment
);

module.exports = router;