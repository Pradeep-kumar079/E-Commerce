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
// ===============================
// BACKEND CONTROLLER FIX
// modifyProduct()
// Added: Existing Images + New Images Merge
// ===============================

exports.modifyProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      type,
      category,
      price,
      stock,
      description,
      brand,
      attributes,
      existingImages,
    } = req.body;

    let parsedAttributes = {};
    if (attributes) {
      try {
        parsedAttributes = JSON.parse(attributes);
      } catch (err) {}
    }

    let oldImages = [];
    if (existingImages) {
      try {
        oldImages = JSON.parse(existingImages);
      } catch (err) {}
    }

    // newly uploaded images
    const newImages =
      req.files?.map(
        (file) => `/uploads/${file.filename}`
      ) || [];

    // merge old + new
    const finalImages = [...oldImages, ...newImages];

    const updateData = {
      name,
      type,
      category,
      price,
      stock,
      description,
      brand,
      attributes: parsedAttributes,
      images: finalImages,
    };

    const product =
      await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

    if (!product) {
      return res
        .status(404)
        .json({ msg: "Product not found" });
    }

    res.json({
      msg: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
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