// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const upload = require("../middleware/upload");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const jwtSecret = process.env.JWT_SECRET;

// PATCH /api/users/:id/avatar
router.patch("/:id/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const avatarPath = "/uploads/" + req.file.filename;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        avatar: avatarPath,
      },
      { new: true }
    );

    res.json({ message: "Avatar updated", avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload avatar" });
  }
});

// POST /api/users/register

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already registered!" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user!" });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1d" });

  res.status(200).json({ token });
});

// GET current user
// GET /api/users/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user is set by authMiddleware after verifying JWT
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update profile
// PATCH /api/users/me
router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = ["username", "email"]; // Allow only safe fields
    const updateData = {};

    for (let field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
