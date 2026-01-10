// // server/controller/orderController.js
// const cashfree = require("cashfree-pg").Cashfree;

// // existing createOrder function here...

// // ✅ Verify order status after redirect
// async function verifyPayment(req, res) {
//   try {
//     const { order_id } = req.query; // frontend sends order_id

//     if (!order_id) {
//       return res.status(400).json({ error: "Missing order_id" });
//     }

//     // Fetch order details from Cashfree
//     const response = await cashfree.pg.getOrder(order_id);

//     res.json({
//       order_id: response.data.order_id,
//       order_amount: response.data.order_amount,
//       order_currency: response.data.order_currency,
//       order_status: response.data.order_status,
//       payment_mode: response.data.payment_method?.payment_mode,
//       reference_id: response.data.payment_method?.upi?.upi_id || null,
//     });
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to verify payment" });
//   }
// }

// module.exports = { createOrder, verifyPayment };
