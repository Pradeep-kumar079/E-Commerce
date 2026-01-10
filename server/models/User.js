const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    isAdmin: { type: Boolean, default: false },
    gender: { type: String },

    //  Wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    //  Cart (if you want to store server-side)
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

