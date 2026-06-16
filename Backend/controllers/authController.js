const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "placeholder@gmail.com",
    pass: process.env.EMAIL_PASS || "placeholderpass"
  }
});

// 1. NEW INSTANT GOOGLE SIGN IN (No OTP required)
exports.googleSignIn = async (req, res) => {
  try {
    const { credential, role } = req.body; 
    let email, name;
    
    if (process.env.DEV_MODE === "true" && credential === "dev-test-token") {
        email = "devuser@vitstudent.ac.in";
        name = "Dev User";
    } else {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
    }

    const vitEmailRegex = /^[\w.]+@(vitstudent\.ac\.in|vit\.ac\.in)$/;
    if (!vitEmailRegex.test(email)) {
      return res.status(400).json({ message: 'Only VIT email addresses are allowed' });
    }

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        name,
        email,
        authProvider: 'google',
        role: role || 'student'
      });
      isNewUser = true;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      token, 
      user: { id: user._id, name: user.name, role: user.role },
      isNewUser,
      message: 'Google login successful' 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. MANUAL SIGNUP (Triggers OTP Email)
exports.manualSignup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const vitEmailRegex = /^[\w.]+@(vitstudent\.ac\.in|vit\.ac\.in)$/;
    if (!vitEmailRegex.test(email)) {
      return res.status(400).json({ message: 'Only VIT email addresses are allowed' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { email },
      { email, otp, name, password: hashedPassword, role: role || 'student' },
      { upsert: true, new: true }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER || "CampusConnect",
      to: email,
      subject: 'CampusConnect - Your Verification Code',
      text: `Your OTP for CampusConnect is: ${otp}. It is valid for 5 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error.message);
        return res.status(200).json({ message: 'OTP generated (Email not configured, check console)', email });
      } else {
        return res.status(200).json({ message: 'OTP sent to email', email });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. VERIFY OTP (Completes Manual Signup)
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: 'OTP expired or not requested' });

    if (otpRecord.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    let user = await User.findOne({ email });
    let isNewUser = false;
    
    if (!user) {
      user = await User.create({ 
        name: otpRecord.name, 
        email, 
        password: otpRecord.password, // Password was already hashed during manualSignup
        authProvider: 'manual',
        role: otpRecord.role 
      });
      isNewUser = true;
    }

    await OTP.deleteOne({ email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      token, 
      user: { id: user._id, name: user.name, role: user.role },
      isNewUser 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. MANUAL LOGIN
exports.manualLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Block Google users from using the password form
    if (user.authProvider === 'google' && !user.password) {
       return res.status(400).json({ message: 'Please sign in with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. GET ME (Fetches logged-in user profile)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};