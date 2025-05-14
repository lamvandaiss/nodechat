// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const upload = require("../middleware/upload");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

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

  const token = jwt.sign({ userId: user._id }, "your-secret-key", {
    expiresIn: "1d",
  });
  res.status(200).json({ token });
});

// GET current user
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  console.log(user);
  res.json(user);
});

// PUT update profile
router.put("/me", authMiddleware, async (req, res) => {
  const { username, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.userId,
    { username, email },
    { new: true }
  );
  res.json(updatedUser);
});

// POST logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

module.exports = router;
