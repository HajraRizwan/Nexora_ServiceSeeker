// settings.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Document Schema
const documentSchema = new mongoose.Schema({
  type: { type: String, enum: ["terms", "privacy"], required: true, unique: true },
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const Document = mongoose.model("Document", documentSchema);

// Get all documents
router.get("/", async (req, res) => {
  try {
    const docs = await Document.find({});
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a document
router.put("/:type", async (req, res) => {
  const { type } = req.params;
  const { content } = req.body;

  try {
    const doc = await Document.findOneAndUpdate(
      { type },
      { content, updatedAt: Date.now() },
      { new: true, upsert: true } // create if not exist
    );

    res.json({ message: `${type} updated successfully`, doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
