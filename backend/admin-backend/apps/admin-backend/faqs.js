// admin-backend/routes/faqs.js
/*import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ===== MongoDB Connection =====
const MONGO_URI = "mongodb://localhost:27017/adminDB"; // replace with your Admin DB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Admin MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===== Schema & Model =====
const adminFaqSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, default: "" }, // Admin can update later
    source: { type: String, default: "Service Seeker" }, // optional
    status: { type: String, default: "Pending" }, // optional
  },
  { timestamps: true }
);

const AdminFAQ = mongoose.model("AdminFAQ", adminFaqSchema);

// ===== Routes =====

// POST - Receive FAQ from Service Seeker backend
router.post("/", async (req, res) => {
  try {
    const { subject, question } = req.body;

    if (!subject || !question) {
      return res.status(400).json({ message: "Subject and question are required" });
    }

    const newAdminFaq = new AdminFAQ({ subject, question });
    await newAdminFaq.save();

    res.status(201).json({ message: "FAQ received and stored", data: newAdminFaq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - View all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await AdminFAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update FAQ answer (optional)
router.put("/:id", async (req, res) => {
  try {
    const { answer, status } = req.body;
    const faq = await AdminFAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    if (answer) faq.answer = answer;
    if (status) faq.status = status;

    await faq.save();
    res.json({ message: "FAQ updated", data: faq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;*/
