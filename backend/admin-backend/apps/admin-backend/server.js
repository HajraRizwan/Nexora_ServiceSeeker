// ==========================
// 🌐 IMPORTS & CONFIG
// ==========================
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';



// Import route files
import registrationRoutes from '../../../service-pp-backend/reg.js';
import skillsRoutes from '../../../service-pp-backend/skills.js';
import certificatesRoutes from '../../../service-pp-backend/certs.js';
import verificationRoutes from './verification.js';
// ==========================
// 🚀 INITIALIZE APP
// ==========================
const app = express();
const PORT = process.env.PORT || 5001;

// ==========================
// 🧩 MIDDLEWARES
// ==========================
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api', verificationRoutes);
app.get('/api/test', (req, res) => res.send('Server works'));

// ==========================
// 🧠 MONGO CONNECTION
// ==========================
mongoose
  .connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/adminDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB Connected');
    createDefaultAdmin(); // ensure admin account exists
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ==========================
// 👤 USER MODEL (for admin panel)
// ==========================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  resetToken: String,
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// ==========================
// 🧩 VALIDATION HELPERS
// ==========================
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

// ==========================
// 👑 DEFAULT ADMIN CREATION
// ==========================
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'Hem@admin';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = new User({ email: adminEmail, password: adminPassword, role: 'admin' });
      await admin.save();
      console.log(`✅ Default admin created: ${adminEmail}`);
    } else {
      console.log('✅ Admin already exists');
    }
  } catch (err) {
    console.error('❌ Error creating default admin:', err);
  }
};

// ==========================
// 🔐 AUTH ROUTES
// ==========================

// Register (admin/user)
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  if (!validateEmail(email))
    return res.status(400).json({ message: 'Invalid email format' });

  if (!validatePassword(password))
    return res.status(400).json({
      message:
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character',
    });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const newUser = new User({ email, password, role: role || 'user' });
    await newUser.save();

    res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  if (!validateEmail(email))
    return res.status(400).json({ message: 'Invalid email format' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ success: true, message: 'Login successful', role: user.role, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================
// 📦 API ROUTES (Registration System)
// ==========================
app.use('/api', registrationRoutes);
app.use('/api', skillsRoutes);
app.use('/api', certificatesRoutes);
app.use('/api', verificationRoutes);

// ==========================
// 💓 HEALTH CHECK
// ==========================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ==========================
// ⚠️ GLOBAL ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ==========================
// 🚀 START SERVER
// ==========================

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



app.get('/api/test', (req, res) => res.send('Server works'));


app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

