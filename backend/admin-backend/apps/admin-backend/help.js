import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const helpSchema = new mongoose.Schema({
  subject: String,
  reason: String,
  explanation: String,
  status: { type: String, default: "Pending" },
});

const Help = mongoose.model("Help", helpSchema);

// POST route to receive help requests
router.post("/", async (req, res) => {
  try {
    const { subject, reason, explanation } = req.body;
    const newHelp = new Help({ subject, reason, explanation });
    await newHelp.save();
    res.status(201).json({ message: "Help saved successfully", data: newHelp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET route to view all help requests
router.get("/", async (req, res) => {
  const helps = await Help.find().sort({ createdAt: -1 });
  res.json(helps);
});

export default router;
