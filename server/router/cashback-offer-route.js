const express = require("express");
const router = express.Router();
const CashbackOffer = require("../models/cashbackOfferSchema");
const { protectAdmin } = require("../middleware/authMiddleware");

// GET public — current cashback offer config
router.get("/", async (req, res) => {
  try {
    let offer = await CashbackOffer.findOne().sort({ updatedAt: -1 }).lean();
    if (!offer) {
      offer = await CashbackOffer.create({
        isActive: false,
        bannerText: "Get up to 15% Cashback Coins in your Buyzone Account on purchases! Min purchase ₹300 (5%), ₹600 (10%), ₹900 & above (15%). Use coins in your next purchase!",
        minPurchase: 300,
        midPurchase: 600,
        maxPurchase: 900,
        minCashbackPercent: 5,
        midCashbackPercent: 10,
        maxCashbackPercent: 15,
      });
    }
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cashback offer" });
  }
});

// PUT admin — upsert cashback offer config
router.put("/", protectAdmin, async (req, res) => {
  try {
    const {
      isActive,
      bannerText,
      minPurchase,
      midPurchase,
      maxPurchase,
      minCashbackPercent,
      midCashbackPercent,
      maxCashbackPercent,
    } = req.body;

    let offer = await CashbackOffer.findOne().sort({ updatedAt: -1 });
    if (!offer) offer = new CashbackOffer();

    if (isActive !== undefined) offer.isActive = isActive;
    if (bannerText !== undefined) offer.bannerText = bannerText;
    if (minPurchase !== undefined) offer.minPurchase = Number(minPurchase);
    if (midPurchase !== undefined) offer.midPurchase = Number(midPurchase);
    if (maxPurchase !== undefined) offer.maxPurchase = Number(maxPurchase);
    if (minCashbackPercent !== undefined) offer.minCashbackPercent = Number(minCashbackPercent);
    if (midCashbackPercent !== undefined) offer.midCashbackPercent = Number(midCashbackPercent);
    if (maxCashbackPercent !== undefined) offer.maxCashbackPercent = Number(maxCashbackPercent);

    await offer.save();
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cashback offer" });
  }
});

module.exports = router;
