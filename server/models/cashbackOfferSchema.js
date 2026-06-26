const mongoose = require("mongoose");

const cashbackOfferSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: false },
    bannerText: {
      type: String,
      default: "Get up to 15% Cashback Coins in your Buyzone Account on purchases! Min purchase ₹300 (5%), ₹600 (10%), ₹900 & above (15%). Use coins in your next purchase!"
    },
    minPurchase: { type: Number, default: 300 },
    midPurchase: { type: Number, default: 600 },
    maxPurchase: { type: Number, default: 900 },
    minCashbackPercent: { type: Number, default: 5 },
    midCashbackPercent: { type: Number, default: 10 },
    maxCashbackPercent: { type: Number, default: 15 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CashbackOffer", cashbackOfferSchema);
