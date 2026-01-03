// backend/privacy.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const router = express.Router();

// Enable CORS so frontend can access
router.use(cors());

// ✅ Schema + Model
const privacySchema = new mongoose.Schema({
  title: String,
  content: String,
  lastUpdated: { type: Date, default: Date.now },
});

const Privacy = mongoose.model("Privacy", privacySchema);

// 🪄 Insert dummy data automatically if empty
(async () => {
  try {
    const count = await Privacy.countDocuments();
    if (count === 0) {
      await Privacy.create({
        title: "Privacy & Security Policy",
        content: `At Nexora, we value your privacy and security.
Your personal information is never shared with unauthorized parties.
All communication between your device and our servers is encrypted using industry standards.
We collect only essential information required to enhance your user experience.
Users can delete their accounts at any time, permanently removing stored data.`,
      });
      console.log("✅ Dummy privacy data inserted");
    }
  } catch (err) {
    console.error("❌ Error inserting dummy data:", err.message);
  }
})();

// ➕ Add new privacy data
router.post("/", async (req, res) => {
  try {
    const newPrivacy = new Privacy({
      title: req.body.title || "Privacy & Security Policy of Nexora App",
      content: req.body.content || `Default privacy text goes here.`,
    });

    await newPrivacy.save();
    res.status(201).json({ message: "Privacy data saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📄 Fetch privacy data
router.get("/", async (req, res) => {
  try {
    const data = await Privacy.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
