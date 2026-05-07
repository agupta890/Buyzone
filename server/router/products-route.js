const express = require('express');
const Product = require('../models/productSchema'); // Adjust path if needed


const router = express.Router();

// GET products (filter by category, subCategory, bestseller)
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, bestsellers, page = 1, limit = 12 } = req.query;
    let query = {};

    if (category) {
      query.category = category; // e.g. "home-decor"
    }

    if (subCategory) {
      // Case-insensitive match for subCategory
      query.subcategory = { $regex: new RegExp("^" + subCategory + "$", "i") };
    }

    if (bestsellers) {
      query.isBestsellers = bestsellers === "true"; // ?bestsellers=true
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Use .lean() for faster execution as these are read-only plain objects
    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (products.length > 0) {
      console.log("GET /api/products - Sample product keys:", Object.keys(products[0]));
      console.log("GET /api/products - Sample product description exists:", !!products[0].description);
    }

    const total = await Product.countDocuments(query);

    res.json({ 
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST new product
router.post('/', async (req, res) => {
  try {
    console.log("POST /api/products - Incoming body keys:", Object.keys(req.body));
    const { name, price, image, category, subcategory, stock, isBestsellers, description } = req.body;
    console.log("Description received:", description ? `Yes (${description.length} chars)` : "No");

    const newProduct = new Product({
      name,
      price,
      image,
      category,
      subcategory, 
      stock,
      description: description || "",
      isBestsellers: isBestsellers || false, // ✅ ensure default
    });

    await newProduct.save();
    console.log("✅ Successfully saved product with description length:", newProduct.description?.length);
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
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log("Fetching product:", product._id, "Description length:", product.description?.length);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
