const mongoose = require("mongoose");

const userScehma = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: { type: String, unique: true, max: 50, required: true },
  password: { type: String, min: 8, max: 50, required: true },
  isAvatarImageSet: { type: Boolean, default: false },
  avatarImage: { type: String, default: "" },
});

module.exports = mongoose.model("Users", userScehma);
