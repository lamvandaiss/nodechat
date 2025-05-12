const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Or specify your frontend URL
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));
app.use("/uploads", express.static("public/uploads"));

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("Chat backend is running!");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    const { sender, content } = data;

    // Save message to DB
    const newMessage = new Message({ sender, content });
    await newMessage.save();

    // Broadcast to all clients
    io.emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
