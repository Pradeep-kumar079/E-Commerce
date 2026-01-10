const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser, logoutUser } = require("../controller/authController");
const verifyToken = require("../middleware/verifyToken");


// register route
router.post("/register", registerUser);

// login route`
router.post("/login", loginUser);

//  logout route
router.post("/logout", logoutUser);

module.exports = router;




// // ✅ protected route
// router.get("/user", verifyToken, getUser);
