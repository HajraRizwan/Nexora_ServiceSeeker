const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Define Schema
const helplineSchema = new mongoose.Schema({
  service: { type: String, required: true },
  number: { type: String, required: true },
  city: { type: String, required: true },
  backup: { type: String },
});

// ✅ Create Model
const Helpline = mongoose.model("Helpline", helplineSchema);

// ✅ Get all helplines
router.get("/", async (req, res) => {
  try {
    const helplines = await Helpline.find();
    res.json(helplines);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch helplines", error: err });
  }
});

// ✅ Add new helpline
router.post("/", async (req, res) => {
  try {
    const newHelpline = new Helpline(req.body);
    await newHelpline.save();
    res.json({ message: "Helpline added successfully", helpline: newHelpline });
  } catch (err) {
    res.status(500).json({ message: "Failed to add helpline", error: err });
  }
});

// ✅ Update helpline
router.put("/:id", async (req, res) => {
  try {
    const updatedHelpline = await Helpline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Helpline updated successfully", helpline: updatedHelpline });
  } catch (err) {
    res.status(500).json({ message: "Failed to update helpline", error: err });
  }
});

// ✅ Delete helpline
router.delete("/:id", async (req, res) => {
  try {
    await Helpline.findByIdAndDelete(req.params.id);
    res.json({ message: "Helpline deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete helpline", error: err });
  }
});

module.exports = router;
