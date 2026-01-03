// reg.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();
console.log("✅ reg.js OTP routes loaded");

// Temporary in-memory store for OTPs
const otpStore = {}; // { email: { otp, expiresAt } }

// Configure mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "hajrar@beingagilist.com",
    pass: process.env.EMAIL_PASS || "bcnmiasutwglxszs", // ⚠️ Use App Password ideally
  },
});

// Generate a random 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

// -------------------------
// Test route
// -------------------------
router.get("/test", (req, res) => {
  res.json({ success: true, message: "✅ OTP routes are working!" });
});

// -------------------------
// Send OTP
// -------------------------
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = generateOtp();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // expires in 5 mins

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// -------------------------
// Verify OTP
// -------------------------
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record)
    return res.status(400).json({ success: false, message: "OTP not found or expired" });

  if (Date.now() > record.expiresAt)
    return res.status(400).json({ success: false, message: "OTP expired" });

  if (parseInt(otp) === record.otp) {
    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// -------------------------
// Resend OTP
// -------------------------
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = generateOtp();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your New OTP Code",
    text: `Your new OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Resent OTP for ${email}: ${otp}`);
    res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Email resend failed:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP" });
  }
});

export default router;
