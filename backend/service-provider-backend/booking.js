// booking.js
import mongoose from "mongoose";
import multer from "multer";

// ✅ Booking Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  categories: Array,
  subcategories: Array,
  bookingType: String,
  amount: String,
  description: String,
  scheduleDate: String,
  scheduleTime: String,
  image: String, // store image as Base64 string
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

// ✅ Multer setup (store file in memory to convert to Base64)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ✅ POST booking handler
export async function handleBooking(req, res) {
  try {
    const {
      name,
      email,
      phone,
      address,
      categories,
      subcategories,
      bookingType,
      amount,
      description,
      scheduleDate,
      scheduleTime,
    } = req.body;

    // Convert image to Base64 if uploaded
    let imageBase64 = null;
    if (req.file) {
      imageBase64 = req.file.buffer.toString("base64");
    }

    const newBooking = new Booking({
      name,
      email,
      phone,
      address,
      categories: JSON.parse(categories),
      subcategories: JSON.parse(subcategories),
      bookingType,
      amount,
      description,
      scheduleDate,
      scheduleTime,
      image: imageBase64,
    });

    await newBooking.save();
    res.status(201).json({ success: true, message: "Booking saved successfully", data: newBooking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// ✅ GET all bookings handler
export async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
