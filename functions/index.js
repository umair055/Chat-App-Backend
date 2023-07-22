const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const userRoutes = require("../routes/userRoutes");
const messagesRoutes = require("../routes/messagesRoutes");
const socket = require("socket.io");
const serverless = require("serverless-http");
const router = require("express").Router();

app.use(cors());
app.use(express.json());
router.get("/", (req, res) => {
  res.json({ hello: "hi!" });
});
app.use("/.netlify/funtions/api", router);
app.use("/.netlify/funtions/api/auth", userRoutes);
app.use("/.netlify/funtions/api/messages", messagesRoutes);
mongoose
  .connect(process.env.MONGO_URl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DATABASE CONNECTED SUCCESSFULLY"))
  .catch((err) => console.log(err));

const server = app.listen(process.env.PORT, () =>
  console.log(`SERVER STARTED ON PORT ${process.env.PORT}`)
);

const io = socket(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
module.exports.handler = serverless(app);
