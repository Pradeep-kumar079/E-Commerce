const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Register controller
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin , phone} = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: name,
      email,
      phone,
      password: hashed,
      isAdmin: isAdmin || false,
    });

    await newUser.save();
    res.status(201).json({ msg: "User registered" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

/// Login controller
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Username credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Password credentials" });

    // Create JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Logout controller
exports.logoutUser = async (req, res) => {
  res.json({ msg: "Logged out successfully" });
};





 