// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        attributes: {
          type: Map,
          of: mongoose.Schema.Types.Mixed, // Dynamic attributes (size, color, etc.)
          default: {}
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, 'Quantity must be at least 1'],
        }
      }
    ]
  },
  { timestamps: true }
);

// Prevent duplicate products with same attributes
cartSchema.pre('save', function (next) {
  const seen = new Set();
  for (let item of this.items) {
    const key = `${item.productId.toString()}_${JSON.stringify([...item.attributes])}`;
    if (seen.has(key)) {
      return next(new Error('Duplicate product with same attributes is not allowed in cart'));
    }
    seen.add(key);
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
