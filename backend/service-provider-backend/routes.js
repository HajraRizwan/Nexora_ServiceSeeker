// routes.js
import express from "express";
import privacyRouter from "./privacy.js";
import profileRouter from "./profile.js";
import faqRouter from "./faqs.js";
import loginRouter from "./auth.js"; // common login forwarding

const router = express.Router();

router.use("/privacy", privacyRouter);
router.use("/profile", profileRouter);
router.use("/faq", faqRouter);
router.use("/login", loginRouter);

export default router;
