const express = require("express");
const router = express.Router();
const FlashSale = require("../models/flashSaleSchema");
const { protectAdmin } = require("../middleware/authMiddleware");

// GET public — current flash sale config
router.get("/", async (req, res) => {
  try {
    let sale = await FlashSale.findOne().sort({ updatedAt: -1 }).lean();
    if (!sale) {
      sale = await FlashSale.create({ isActive: false, label: "Flash Sale", rules: [] });
    }
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch flash sale" });
  }
});

// PUT admin — upsert entire flash sale config
router.put("/", protectAdmin, async (req, res) => {
  try {
    const { isActive, label, startsAt, endsAt, rules } = req.body;
    let sale = await FlashSale.findOne().sort({ updatedAt: -1 });
    if (!sale) sale = new FlashSale();

    if (isActive !== undefined) sale.isActive = isActive;
    if (label !== undefined) sale.label = label;
    if (startsAt !== undefined) sale.startsAt = startsAt || null;
    if (endsAt !== undefined) sale.endsAt = endsAt || null;
    if (rules !== undefined) sale.rules = rules;

    await sale.save();
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: "Failed to update flash sale" });
  }
});

module.exports = router;
