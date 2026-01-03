import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ===== Profile Schema =====
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    location: { type: String },
    profilePhoto: { type: String, default: "https://via.placeholder.com/100" },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

// ===== Routes =====

// GET profile by email
router.get("/:email", async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.email });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update profile
router.put("/update/:email", async (req, res) => {
  try {
    const { name, location, profilePhoto } = req.body;
    const email = req.params.email;

    if (!name || !email)
      return res.status(400).json({ message: "Name and email are required" });

    const updatedProfile = await Profile.findOneAndUpdate(
      { email },
      { name, location, profilePhoto },
      { new: true, upsert: true } // create if not exist
    );

    res.json({ message: "Profile updated successfully", data: updatedProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
