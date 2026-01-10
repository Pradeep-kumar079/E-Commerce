const Product = require("../models/Product");
const Orders = require("../models/Order");


// -------------------------------------these are all product releated controllers-------------------------------------//

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get single product
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Add product
exports.addProduct = async (req, res) => {
  try {
    const { name, type, category, price, stock, description, brand, attributes } = req.body;
    const images = req.files?.map(file => `/uploads/${file.filename}`) || [];
    const parsedAttributes = attributes ? JSON.parse(attributes) : {};

    const product = new Product({
      name,
      type,
      category,
      price,
      stock,
      description,
      brand,
      attributes: parsedAttributes,
      images
    });

    await product.save();
    res.status(201).json({ msg: "Product added successfully", product });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Modify product
exports.modifyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, category, price, stock, description, brand, attributes } = req.body;

    // Parse attributes safely
    let parsedAttributes = {};
    if (attributes) {
      try {
        parsedAttributes = JSON.parse(attributes);
      } catch (err) {
        console.warn("Attributes not valid JSON, ignoring:", err.message);
      }
    }

    // Only update images if new files are uploaded
    const images = req.files && req.files.length > 0
      ? req.files.map(file => `/uploads/${file.filename}`)
      : undefined;

    // Build update object dynamically
    const updateData = { name, type, category, price, stock, description, brand, attributes: parsedAttributes };
    if (images) updateData.images = images;

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.json({ msg: "Product modified successfully", product });
  } catch (err) {
    console.error("Modify product error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


//-------------------------these are all order related controllers-------------------------------------//

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const Orders = await Order.find().sort({ createdAt: -1 });
    res.json(Orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get single order by ID
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};