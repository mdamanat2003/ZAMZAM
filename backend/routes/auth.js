const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

const mongoose = require('mongoose');

// Register
router.post('/register', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database connection in progress or unavailable. Please try again shortly.' });
    }
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashed, isAdmin: false });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message || 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database connection in progress or unavailable. Please try again shortly.' });
    }
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, address: user.address || null } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Server error during login' });
  }
});

// Update user address (protected)
router.put('/address', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.address = req.body;
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, address: user.address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
