// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "/uploads/default.png" }, // Path to uploaded image
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
