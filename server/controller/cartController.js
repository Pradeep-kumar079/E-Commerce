const Cart = require('../models/Cart');


//------------------------------ these are for cart controller------------------------------//

//this route for getting the cart products
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.status(200).json({ cart: cart || { items: [] } });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

//this route for adding products to the cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, attributes } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if same product with same attributes already exists
    const existingItem = cart.items.find(item => 
      item.productId.toString() === productId &&
      JSON.stringify(item.attributes || {}) === JSON.stringify(attributes || {})
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1, attributes });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

//this route for updating the quantity of products in the cart
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, attributes, action } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => 
      i.productId.toString() === productId &&
      JSON.stringify(i.attributes || {}) === JSON.stringify(attributes || {})
    );

    if (!item) return res.status(404).json({ message: 'Product not found in cart' });

    if (action === 'increase') item.quantity += 1;
    if (action === 'decrease' && item.quantity > 1) item.quantity -= 1;

    await cart.save();
    res.status(200).json({ message: 'Quantity updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error updating quantity', error: err.message });
  }
};
//this is for deleting products from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const attributes = req.query.attributes ? JSON.parse(req.query.attributes) : {};

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => 
      !(i.productId.toString() === productId &&
        JSON.stringify(i.attributes || {}) === JSON.stringify(attributes || {}))
    );

    await cart.save();
    res.status(200).json({ message: 'Product removed', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing product', error: err.message });
  }
};
