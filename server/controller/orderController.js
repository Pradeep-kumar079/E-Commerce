// controller/orderController.js

const axios = require("axios");
const Order = require("../models/Order");
require("dotenv").config();

const CASHFREE_BASE_URL =
  "https://sandbox.cashfree.com";

const CASHFREE_CLIENT_ID =
  process.env.CASHFREE_CLIENT_ID;

const CASHFREE_CLIENT_SECRET =
  process.env.CASHFREE_CLIENT_SECRET;

/* =================================
   CREATE ORDER
================================= */

const createOrder = async (req, res) => {
  const {
    amount,
    customer,
    orderItems,
    shippingAddress,
  } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Please login before buying.",
      });
    }

    if (
      !amount ||
      !customer ||
      !customer.customer_id
    ) {
      return res.status(400).json({
        error: "Invalid order data",
      });
    }

    const {
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
    } = customer;

    const orderId =
      "order_" + Date.now();

    const cfBody = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",

      customer_details: {
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
      },

      order_meta: {
        // safer URL naming
        return_url:
          "https://e-commerce-frontend-u0z8.onrender.com/order-success?order_id={order_id}",
      },

      order_note:
        "Order created from MERN E-commerce",
    };

    const cfRes = await axios.post(
      `${CASHFREE_BASE_URL}/pg/orders`,
      cfBody,
      {
        headers: {
          "Content-Type":
            "application/json",
          "x-api-version":
            "2022-09-01",
          "x-client-id":
            CASHFREE_CLIENT_ID,
          "x-client-secret":
            CASHFREE_CLIENT_SECRET,
        },
      }
    );

    const cfData = cfRes.data;

    // Save order in DB
    const newOrder = new Order({
      user: customer_id,
      orderItems,
      shippingAddress,
      totalAmount: amount,
      orderId: cfData.order_id,
      paymentSessionId:
        cfData.payment_session_id,
      paymentStatus: "Pending",
    });

    await newOrder.save();

    return res.json({
      orderId: cfData.order_id,
      paymentSessionId:
        cfData.payment_session_id,
    });
  } catch (err) {
    console.error(
      "Create Order Error:",
      err.response?.data ||
        err.message ||
        err
    );

    const status =
      err.response?.status || 500;

    const data =
      err.response?.data || {
        error: {
          message:
            "Internal error while creating order",
        },
      };

    return res.status(status).json(data);
  }
};

/* =================================
   ORDER STATUS
   (Renamed verifyPayment logic)
================================= */

const verifyPayment = async (
  req,
  res
) => {
  const { order_id } = req.query;

  try {
    if (!order_id) {
      return res.status(400).json({
        error: "Missing order_id",
      });
    }

    // Fetch payment status from Cashfree
    const cfRes = await axios.get(
      `${CASHFREE_BASE_URL}/pg/orders/${order_id}`,
      {
        headers: {
          "x-api-version":
            "2022-09-01",
          "x-client-id":
            CASHFREE_CLIENT_ID,
          "x-client-secret":
            CASHFREE_CLIENT_SECRET,
        },
      }
    );

    const data = cfRes.data;

    // Update order in DB
    const updatedOrder =
      await Order.findOneAndUpdate(
        { orderId: order_id },
        {
          paymentStatus:
            data.order_status ===
            "PAID"
              ? "Paid"
              : "Pending",
        },
        { new: true }
      )
        .populate(
          "orderItems.product"
        )
        .lean();

    return res.json({
      order_id: data.order_id,
      order_amount:
        data.order_amount,
      order_currency:
        data.order_currency,
      order_status:
        data.order_status,
      payment_method:
        data.payment_method ||
        null,
      order:
        updatedOrder || null,
    });
  } catch (err) {
    console.error(
      "Order Status Error:",
      err.response?.data ||
        err.message ||
        err
    );

    const status =
      err.response?.status || 500;

    const errorData =
      err.response?.data || {
        error: {
          message:
            "Failed to fetch order status",
        },
      };

    return res.status(status).json({
      success: false,
      ...errorData,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};