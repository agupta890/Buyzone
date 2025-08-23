const express = require('express');
const Product = require('../models/productSchema'); // Adjust path if needed

const router = express.Router();

// GET products (filter by category & subCategory if provided)
router.get('/', async (req, res) => {
  try {
    const { category, subCategory } = req.query;
    let query = {};

    if (category) {
      query.category = category; // e.g. "home-decor"
    }

    if (subCategory) {
      // Case-insensitive match for subCategory
      query.subcategory = { $regex: new RegExp("^" + subCategory + "$", "i") };
    }

    const products = await Product.find(query);
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    const { name, price, image, category, subcategory, stock } = req.body;

    const newProduct = new Product({
      name,
      price,
      image,
      category,
      subcategory, // ✅ make sure schema includes this
      stock,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
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

module.exports = router;
