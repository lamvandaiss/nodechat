// routes/messages.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
