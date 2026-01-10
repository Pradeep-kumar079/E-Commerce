// // server.js (fixed) - replace your existing file with this
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const cors = require('cors');
// require('dotenv').config();

// // Route imports (kept as you had them)
// const authRoutes = require('./routes/authRoutes');
// const AdminRoutes = require('./routes/AdminRoutes');
// const homeRoutes = require('./routes/homeRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const orderRoutes = require("./routes/orderRoutes");
// const UserRoutes = require('./routes/UserRoutes');

// const app = express();

// // ---------- Logging middleware (temporary, helpful) ----------
// app.use((req, res, next) => {
//   console.log(`[REQ] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
//   next();
// });

// // ---------- CORS CONFIG ----------
// const allowedOrigins = [
//   "https://e-commerce-frontend-u0z8.onrender.com",
//   // add other allowed frontends here if needed
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // allow requests with no origin (like Postman, curl, Render health checks)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     console.log("Blocked by CORS:", origin);
//     return callback(new Error("Not allowed by CORS"));
//   },
//   methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 200, // ensures older browsers get HTTP 200 for preflight
// };

// // Apply CORS middleware globally
// app.use(cors(corsOptions));

// // Explicitly handle OPTIONS preflight for all routes
// app.options('/*', cors(corsOptions));

// // ---------- Middlewares ----------
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // (Optional) health check route for Render/browser
// app.get('/', (req, res) => {
//   res.send('API is running ✅');
// });

// // ---------- Database connection ----------
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // ---------- Routes (kept unchanged) ----------
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', AdminRoutes);
// app.use('/api/home', homeRoutes);
// app.use('/api/user', UserRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/order', orderRoutes);

// // ---------- Server start ----------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.js (FINAL – STABLE – NODE 20 SAFE)

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// -------- Route Imports --------
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const homeRoutes = require("./routes/homeRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/UserRoutes");

const app = express();

/* ================================
   BASIC MIDDLEWARES
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   CORS (SAFE – NO WILDCARDS)
================================ */
const allowedOrigins = [
  "https://e-commerce-frontend-u0z8.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / server-to-server
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ❌ DO NOT USE app.options('*') OR app.options('/*') ❌ */

/* ================================
   STATIC FILES
================================ */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("API running ✅");
});

/* ================================
   DATABASE CONNECTION
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

/* ================================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", userRoutes);

/* ================================
   404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
