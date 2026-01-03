const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Training Schema
const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  duration: { type: String },
  mandatory: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Training = mongoose.model("Training", trainingSchema);

// ✅ Get all training videos
router.get("/", async (req, res) => {
  try {
    const trainings = await Training.find();
    res.json(trainings);
  } catch (err) {
    console.error("Error fetching training videos:", err);
    res.status(500).json({ message: "Failed to fetch training videos" });
  }
});

// ✅ Add new training video
router.post("/", async (req, res) => {
  try {
    console.log("Received data:", req.body); // ✅ Log request for debugging

    const newTraining = new Training({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      duration: req.body.duration,
      mandatory: req.body.mandatory
    });

    const savedTraining = await newTraining.save();
    res.status(201).json({ message: "Training video added successfully", training: savedTraining });
  } catch (err) {
    console.error("Error saving training:", err);
    res.status(500).json({ message: "Failed to save training", error: err.message });
  }
});

// ✅ Delete training video
router.delete("/:id", async (req, res) => {
  try {
    await Training.findByIdAndDelete(req.params.id);
    res.json({ message: "Training video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete training", error: err.message });
  }
});

module.exports = router;
