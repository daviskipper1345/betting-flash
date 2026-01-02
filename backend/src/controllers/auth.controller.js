const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
* @desc    Register user
* @route   POST /api/auth/register
*/
exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password
    } = req.body;

    // 1. Validate input
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
* @desc    Login user
* @route   POST /api/auth/login
*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};