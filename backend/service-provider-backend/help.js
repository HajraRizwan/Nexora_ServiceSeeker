// help.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Define Schema
const helpSchema = new mongoose.Schema({
  subject: String,
  reason: String,
  explanation: String,
  createdAt: { type: Date, default: Date.now },
});

// ✅ Create Model
const Help = mongoose.model("Help", helpSchema);

// ✅ POST route to save complaint
router.post("/help", async (req, res) => {
  try {
    const { subject, reason, explanation } = req.body;
    if (!subject || !reason || !explanation) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newHelp = new Help({ subject, reason, explanation });
    await newHelp.save();
    res.status(201).json({ message: "Complaint saved successfully!" });
  } catch (error) {
    console.error("Error saving complaint:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ GET route (optional — view all complaints)
router.get("/help", async (req, res) => {
  try {
    const complaints = await Help.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
