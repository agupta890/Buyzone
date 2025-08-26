const express = require('express');
const Product = require('../models/productSchema'); // Adjust path if needed


const router = express.Router();

// GET products (filter by category, subCategory, bestseller)
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, bestsellers } = req.query;
    let query = {};

    if (category) {
      query.category = category; // e.g. "home-decor"
    }

    if (subCategory) {
      // Case-insensitive match for subCategory
      query.subcategory = { $regex: new RegExp("^" + subCategory + "$", "i") };
    }

    if (bestsellers) {
      query.isBestsellesr = bestsellers === "true"; // ?bestseller=true
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
    const { name, price, image, category, subcategory, stock, isBestsellers } = req.body;

    const newProduct = new Product({
      name,
      price,
      image,
      category,
      subcategory, 
      stock,
      isBestsellers: isBestsellers || false, // ✅ ensure default
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// PATCH update bestseller
router.patch('/:id', async (req, res) => {
  try {
    const { isBestsellers } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isBestsellers },
      { new: true }
    );
    res.json({ message: 'Bestseller updated', product: updatedProduct });
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
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
