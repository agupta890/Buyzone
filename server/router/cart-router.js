const express = require('express');
const Cart = require('../models/cartSchema');
const { protectUser } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get user cart
router.get('/:userId', protectUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    if (cart) {
      cart.items = cart.items.filter(item => item.product !== null);
    }
    res.json(cart || { user: req.params.userId, items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// ✅ Add product to cart
router.post('/:userId/add', protectUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] });
    }

    const productIndex = cart.items.findIndex((i) => i.product.toString() === productId);

    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    if (populatedCart) {
      populatedCart.items = populatedCart.items.filter(item => item.product !== null);
    }
    res.json(populatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// ✅ Remove product from cart
router.delete('/:userId/remove/:productId', protectUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();

    const populatedCart = await cart.populate('items.product');
    if (populatedCart) {
      populatedCart.items = populatedCart.items.filter(item => item.product !== null);
    }
    res.json(populatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// ✅ Update quantity
router.patch('/:userId/update/:productId', protectUser, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (item) item.quantity = quantity;

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    if (populatedCart) {
      populatedCart.items = populatedCart.items.filter(item => item.product !== null);
    }
    res.json(populatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// ✅ Clear cart
router.delete('/:userId', protectUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
