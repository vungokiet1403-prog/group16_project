const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true }
);

// tránh re-register khi nodemon reload
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
