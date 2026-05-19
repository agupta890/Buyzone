const express = require("express");
const router = express.Router();
const Category = require("../models/categorySchema");
const { protectAdmin } = require("../middleware/authMiddleware");

// Seed defaults if DB is empty
const SEED = [
  { slug: "home-decor", title: "Home Decor", subtitle: "Luxury & Comfort", icon: "Home", color: "from-blue-500 to-cyan-400", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000&auto=format&fit=crop", subcategories: ["Bedsheet", "Wall Painting"], order: 0 },
  { slug: "books", title: "Books", subtitle: "Knowledge Hub", icon: "Book", color: "from-amber-500 to-orange-400", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000&auto=format&fit=crop", subcategories: ["Fiction", "Non Fiction"], order: 1 },
  { slug: "handy-craft", title: "Handy Craft", subtitle: "Artisan Made", icon: "Paintbrush", color: "from-purple-500 to-pink-400", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop", subcategories: [], order: 2 },
  { slug: "pooja-path-item", title: "Pooja Path Item", subtitle: "Spiritual Essentials", icon: "Flower", color: "from-red-500 to-orange-400", image: "https://images.unsplash.com/photo-1666170263113-b2daf844f352?w=600&auto=format&fit=crop", subcategories: ["Home Temples", "Poshak"], order: 3 },
  { slug: "plants", title: "Plants", subtitle: "Green Life", icon: "Sprout", color: "from-green-500 to-emerald-400", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000&auto=format&fit=crop", subcategories: ["Bonsai Plant", "Artificial Plant"], order: 4 },
  { slug: "toys", title: "Toys", subtitle: "Joy for Kids", icon: "Baby", color: "from-yellow-400 to-amber-500", image: "https://images.unsplash.com/photo-1532330393533-443990a51d10?q=80&w=1000&auto=format&fit=crop", subcategories: [], order: 5 },
  { slug: "cosmetic", title: "Cosmetic", subtitle: "Beauty & Care", icon: "Sparkles", color: "from-pink-400 to-rose-500", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop", subcategories: ["Men", "Women", "Fragrance"], order: 6 },
  { slug: "dry-fruits", title: "Dry Fruits", subtitle: "Healthy Snacking", icon: "Nut", color: "from-stone-500 to-orange-900", image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=1000&auto=format&fit=crop", subcategories: [], order: 7 },
];

// GET all categories (public) — auto-seed if empty
router.get("/", async (req, res) => {
  try {
    let cats = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
    if (cats.length === 0) {
      await Category.insertMany(SEED);
      cats = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
    }
    res.json(cats);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// POST create category (admin)
router.post("/", protectAdmin, async (req, res) => {
  try {
    const { slug, title, subtitle, image, icon, color, subcategories } = req.body;
    if (!slug || !title) return res.status(400).json({ message: "slug and title are required" });

    const exists = await Category.findOne({ slug });
    if (exists) return res.status(400).json({ message: "Category with this slug already exists" });

    const count = await Category.countDocuments();
    const cat = await Category.create({ slug, title, subtitle, image, icon, color, subcategories: subcategories || [], order: count });
    res.status(201).json(cat);
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ message: "Failed to create category" });
  }
});

// PATCH update category (admin)
router.patch("/:slug", protectAdmin, async (req, res) => {
  try {
    const allowed = ["title", "subtitle", "image", "icon", "color", "subcategories", "order"];
    const updates = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    }
    const cat = await Category.findOneAndUpdate({ slug: req.params.slug }, updates, { new: true });
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ message: "Failed to update category" });
  }
});

// DELETE category (admin)
router.delete("/:slug", protectAdmin, async (req, res) => {
  try {
    const cat = await Category.findOneAndDelete({ slug: req.params.slug });
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

module.exports = router;
