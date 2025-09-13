const express = require("express");
const router = express.Router();
const { protectUser } = require("../middleware/authMiddleware");
const Address = require("../models/addressSchema");

// ✅ Get all addresses for logged-in user
router.get("/", protectUser, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json({ addresses });
  } catch (err) {
    console.error("Fetch addresses error:", err);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// ✅ Save new address
router.post("/", protectUser, async (req, res) => {
  try {
    const { name, phone, pincode, house_no, street, city, state ,nearest,isDefault} = req.body;
    if (!name || !phone || !pincode || !street || !city || !state) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAddress = await Address.create({
      user: req.user._id,
      name,
      phone,
      house_no,
      street,
      city,
      state,
      pincode,
      nearest,
      isDefault: isDefault || false,


    });

    res.json({ success: true, address: newAddress });
  } catch (err) {
    console.error("Save address error:", err);
    res.status(500).json({ error: "Failed to save address" });
  }
});

// ✅ Update address
router.put("/:id", protectUser, async (req, res) => {
  try {
    const { id } = req.params;

     // 🔹 If updating to default, unset previous default
    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true },
        { $set: { isDefault: false } }
      );
    }
    
    const updated = await Address.findOneAndUpdate(
      { _id: id, user: req.user._id }, // ensure only owner can update
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Address not found" });
    res.json({ success: true, address: updated });
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ error: "Failed to update address" });
  }
});

// ✅ Delete address
router.delete("/:id", protectUser, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Address.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleted) return res.status(404).json({ error: "Address not found" });
    res.json({ success: true, message: "Address deleted" });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ error: "Failed to delete address" });
  }
});

module.exports = router;
