const express = require("express");
const router = express.Router();
const Slider = require("../models/sliderSchema");
const { protectAdmin } = require("../middleware/authMiddleware");

const SEED_SLIDES = [
  {
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1400&auto=format&fit=crop",
    title: "Elevate Your Everyday",
    subtitle: "Seasonal Collection",
    linkUrl: "/shop-all",
    order: 0,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1400&auto=format&fit=crop",
    title: "Knowledge Hub",
    subtitle: "Books & More",
    linkUrl: "/category/books",
    order: 1,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1400&auto=format&fit=crop",
    title: "Premium Home Decor",
    subtitle: "Luxury & Comfort",
    linkUrl: "/category/home-decor",
    order: 2,
  },
];

// GET public — active slides (seeds defaults if empty)
router.get("/", async (req, res) => {
  try {
    let slides = await Slider.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    if (slides.length === 0) {
      await Slider.insertMany(SEED_SLIDES);
      slides = await Slider.find({ isActive: true }).sort({ order: 1 }).lean();
    }
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch slides" });
  }
});

// GET all (admin) — including inactive
router.get("/all", protectAdmin, async (req, res) => {
  try {
    const slides = await Slider.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch slides" });
  }
});

// POST create slide (admin)
router.post("/", protectAdmin, async (req, res) => {
  try {
    const count = await Slider.countDocuments();
    const slide = await Slider.create({ ...req.body, order: req.body.order ?? count });
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ message: "Failed to create slide" });
  }
});

// PATCH update slide (admin)
router.patch("/:id", protectAdmin, async (req, res) => {
  try {
    const allowed = ["imageUrl", "title", "subtitle", "linkUrl", "order", "isActive"];
    const updates = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    }
    const slide = await Slider.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!slide) return res.status(404).json({ message: "Slide not found" });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ message: "Failed to update slide" });
  }
});

// DELETE slide (admin)
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const slide = await Slider.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });
    res.json({ message: "Slide deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete slide" });
  }
});

module.exports = router;
