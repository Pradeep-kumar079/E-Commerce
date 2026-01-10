// routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getOrders,
  getUserDetails,
  updateUserDetails,
} = require('../controller/UserController');

// GET /api/user/   → return logged-in user details
router.get('/', verifyToken, getUserDetails);

// router.get('/get-orders', verifyToken, getOrders);

// GET /api/user/orders  → all orders of logged-in user (optional but useful)
router.get('/orders', verifyToken, getOrders);

// PUT /api/user/  → update logged-in user profile (optional)
router.put('/', verifyToken, updateUserDetails);

module.exports = router;
