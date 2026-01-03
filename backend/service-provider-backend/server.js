// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";
import authRoutes from "./auth.js";


import regRoutes from "./reg.js";
import { upload, handleBooking, getAllBookings } from "./booking.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/service_seeker_db";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", regRoutes);
app.use("/api/auth", authRoutes); 


// ✅ HTTP + Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ✅ Socket.IO Logic
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", (serviceSeekerId) => {
    socket.join(serviceSeekerId);
    console.log(`Service Seeker joined room: ${serviceSeekerId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ✅ Routes
app.get("/", (req, res) => {
  res.json({ message: "✅ Service Seeker Backend Running" });
});

// Booking Routes
app.get("/api/bookings", getAllBookings);
app.post("/api/bookings", upload.single("image"), async (req, res) => {
  await handleBooking(req, res);

  // Emit new booking event
  if (req.body.serviceSeekerId) {
    io.to(req.body.serviceSeekerId).emit("newBooking", req.body);
  }
});

// ✅ Start Server
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
