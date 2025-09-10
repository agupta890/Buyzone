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
    const { name, phone, pincode, street, city, state } = req.body;
    if (!name || !phone || !pincode || !street || !city || !state) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAddress = await Address.create({
      user: req.user._id, // ✅ link with user id
      name,
      phone,
      street,
      city,
      state,
      pincode,
    });

    res.json({ success: true, address: newAddress });
  } catch (err) {
    console.error("Save address error:", err);
    res.status(500).json({ error: "Failed to save address" });
  }
});

// ✅ Update an address
router.put("/:id", protectUser, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ error: "Address not found" });

    const { name, phone, pincode, street, city, state } = req.body;
    address.name = name || address.name;
    address.phone = phone || address.phone;
    address.pincode = pincode || address.pincode;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;

    await address.save();
    res.json({ success: true, address });
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ error: "Failed to update address" });
  }
});


// ✅ Delete an address
router.delete("/:id", protectUser, async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ error: "Address not found" });

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ error: "Failed to delete address" });
  }
});

module.exports = router;
