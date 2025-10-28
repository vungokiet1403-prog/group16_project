const mongoose = require("./db");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // Bổ sung: Trường password để lưu mật khẩu đã được mã hóa
  password: { type: String, required: true }, 

  // Bổ sung: Trường role để phân quyền (Hoạt động 3)
  role: { type: String, default: 'user' }, 

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);