const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  brand: { type: String },
  stock: { type: Number, default: 0 },
  attributes: { type: mongoose.Schema.Types.Mixed }, // attributes
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
