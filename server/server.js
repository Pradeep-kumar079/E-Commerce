// server.js (FINAL - WITH CORS + RATE LIMIT + HELMET + SAFE DEPLOY)

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

/* =================================
   ROUTE IMPORTS
================================= */

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const homeRoutes = require("./routes/homeRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/UserRoutes");

const app = express();

/* =================================
   BASIC MIDDLEWARES
================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =================================
   SECURITY HEADERS (HELMET)
================================= */

app.use(helmet());

/* =================================
   RATE LIMITER (GLOBAL)
================================= */

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests/IP
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* =================================
   AUTH RATE LIMITER (STRICT)
================================= */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // only 10 login attempts
  message: {
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

/* =================================
   CORS CONFIG (SAFE)
================================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://e-commerce-frontend-u0z8.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / Render health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =================================
   STATIC FILES
================================= */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =================================
   HEALTH CHECK ROUTE
================================= */

app.get("/", (req, res) => {
  res.send("API running successfully ✅");
});

/* =================================
   DATABASE CONNECTION
================================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error(
      "❌ MongoDB connection failed:",
      err.message
    );
    process.exit(1);
  });

/* =================================
   API ROUTES
================================= */

// strict limiter only for auth routes
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", userRoutes);

/* =================================
   404 HANDLER
================================= */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* =================================
   GLOBAL ERROR HANDLER
================================= */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);

  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

/* =================================
   SERVER START
================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});