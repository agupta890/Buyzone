const express = require('express');
const Product = require('../models/productSchema');

const router = express.Router();

// GET products (filter by category, subCategory, bestseller, pagination)
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, bestsellers, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (subCategory) query.subcategory = { $regex: new RegExp("^" + subCategory + "$", "i") };
    if (bestsellers) query.isBestsellers = bestsellers === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Run find and count in parallel instead of sequentially
    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(parseInt(limit)).lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalProducts: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const { name, price, image, category, subcategory, stock, isBestsellers, description, returnDays } = req.body;

    const newProduct = new Product({
      name,
      price,
      image,
      category,
      subcategory,
      stock,
      description: description || "",
      isBestsellers: isBestsellers || false,
      returnDays: returnDays !== undefined ? returnDays : 7,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// PATCH update product (full edit)
router.patch('/:id', async (req, res) => {
  try {
    const allowed = ['name', 'price', 'image', 'category', 'subcategory', 'stock', 'description', 'isBestsellers', 'returnDays'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
