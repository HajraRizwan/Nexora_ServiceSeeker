// faqs.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Schema
const faqSchema = new mongoose.Schema({
  subject: String,
  question: String,
  answer: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const FAQ = mongoose.model("FAQ", faqSchema);

// POST /api/faqs
router.post("/faqs", async (req, res) => {
  try {
    const { subject, question } = req.body;
    if (!subject || !question) {
      return res.status(400).json({ message: "Subject and question are required." });
    }

    const newFaq = new FAQ({ subject, question });
    await newFaq.save();

    res.status(201).json(newFaq); // return the saved FAQ
  } catch (error) {
    console.error("Error saving FAQ:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/faqs
router.get("/faqs", async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
