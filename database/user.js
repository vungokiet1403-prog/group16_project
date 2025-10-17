const mongoose = require("mongoose");

// Schema User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true });

// Export model
module.exports = mongoose.model("User", userSchema);
