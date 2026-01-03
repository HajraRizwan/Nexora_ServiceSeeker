import express from 'express';
const router = express.Router();

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
//import { ServiceProvider } from '../../../service-pp-backend/ServiceProvider.js'; // add .js if using ESM
// import ServiceProvider from '../../../service-pp-backend/ServiceProvider.js';
import ServiceProvider from './ServiceProvider.js';
import registrationRoutes from '../../../service-pp-backend/reg.js';
import skillsRoutes from '../../../service-pp-backend/skills.js';
import certificatesRoutes from '../../../service-pp-backend/certs.js';
import { Skills } from '../../../service-pp-backend/skills.js';



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verificationSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: true,
      unique: true,
    },
    otp: { type: String, required: true },
    otpExpiry: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'verified'], default: 'pending' },
    password: { type: String, default: null },
    token: { type: String, default: null },
  },
  { timestamps: true }
);

// const Verification = mongoose.model('Verification', verificationSchema);
const Verification = mongoose.models.Verification || mongoose.model('Verification', verificationSchema);


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, action, otp = null) => {
  try {
    let subject, text, html;

    if (action === 'approved') {
      subject = 'Account Verified - Enter OTP';
      html = `
        <h2>Your Account Has Been Approved!</h2>
        <p>Your service provider account has been verified by our admin team.</p>
        <p>Please use the following OTP to complete your registration:</p>
        <h3 style="color: #19034d; font-size: 24px;">${otp}</h3>
        <p>This OTP will expire in 10 minutes.</p>
        <p>Do not share this OTP with anyone.</p>
      `;
    } else if (action === 'rejected') {
      subject = 'Account Verification Failed';
      html = `
        <h2>Account Verification Failed</h2>
        <p>Unfortunately, your service provider account verification was rejected.</p>
        <p>Please contact our support team for more information.</p>
      `;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

// Get all pending registrations
router.get('/admin/pending', async (req, res) => {
  try {
    const providers = await ServiceProvider.find({ status: 'pending' }).select(
      '-profilePhoto -cnicFront -cnicBack -criminalClearance'
    );

    // Enrich providers with skills
    const enrichedProviders = await Promise.all(
      providers.map(async (provider) => {
        const skills = await Skills.find({ providerId: provider._id });
        return {
          ...provider.toObject(),
          skills: skills.map((s) => ({ category: s.category, subcategories: s.subcategories })),
        };
      })
    );

    res.json({
      success: true,
      data: enrichedProviders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Get provider documents
router.get('/admin/provider/:id/documents', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    res.json({
      success: true,
      data: {
        profilePhoto: provider.profilePhoto,
        cnicFront: provider.cnicFront,
        cnicBack: provider.cnicBack,
        criminalClearance: provider.criminalClearance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Approve provider
router.post('/admin/approve/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    let verification = await Verification.findOne({ providerId: provider._id });
    if (!verification) {
      verification = new Verification({
        providerId: provider._id,
        otp,
        otpExpiry,
        status: 'approved',
      });
    } else {
      verification.otp = otp;
      verification.otpExpiry = otpExpiry;
      verification.status = 'approved';
    }

    await verification.save();

    const emailSent = await sendVerificationEmail(provider.email, 'approved', otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send email',
      });
    }

    provider.status = 'approved';
    await provider.save();

    res.json({
      success: true,
      message: 'Provider approved and OTP sent via email',
      data: {
        providerId: provider._id,
        email: provider.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Reject provider
router.post('/admin/reject/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    const provider = await ServiceProvider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    await sendVerificationEmail(provider.email, 'rejected');

    provider.status = 'rejected';
    await provider.save();

    await Verification.deleteOne({ providerId: provider._id });

    res.json({
      success: true,
      message: 'Provider rejected and email sent',
      data: {
        providerId: provider._id,
        email: provider.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const provider = await ServiceProvider.findOne({ email });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    const verification = await Verification.findOne({ providerId: provider._id });
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'No verification record found',
      });
    }

    if (verification.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (new Date() > verification.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }

    verification.status = 'verified';
    await verification.save();

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        providerId: provider._id,
        email: provider.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//Create password
router.post('/create-password', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    const provider = await ServiceProvider.findOne({ email });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    const verification = await Verification.findOne({ providerId: provider._id });
    if (!verification || verification.status !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Please verify OTP first',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    verification.password = hashedPassword;
    verification.status = 'verified';
    await verification.save();

    res.json({
      success: true,
      message: 'Password created successfully',
      data: {
        providerId: provider._id,
        email: provider.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST: Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const provider = await ServiceProvider.findOne({ email });
    if (!provider) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const verification = await Verification.findOne({ providerId: provider._id });
    if (!verification || verification.status !== 'verified' || !verification.password) {
      return res.status(400).json({
        success: false,
        message: 'Account not fully verified or password not set',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, verification.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        providerId: provider._id,
        email: provider.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        providerId: provider._id,
        email: provider.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
export default router;
export { Verification };

