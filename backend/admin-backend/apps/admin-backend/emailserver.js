const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const GMAIL_USER = 'mahnoorasif237@gmail.com';
const GMAIL_PASS = 'bamxpvq';

const app = express();
const PORT = 5001; // Use a different port than your frontend

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Email server is running');
});

// 📩 Send contact form email
app.post('/send-mail', async (req, res) => {
  const { fullName, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: GMAIL_USER,
    to: 'mahnoorasif237@gmail.com',
    subject: `New Contact Request from ${fullName}`,
    html: `
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// 🔐 Forgot Password route
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: GMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Click <a href="http://localhost:3000/reset-password?email=${email}">here</a> to reset your password.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset email sent' });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ message: 'Failed to send reset email' });
  }
});

app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
