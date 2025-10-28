const mongoose = require("mongoose"); // ✅ Sửa: Import thư viện mongoose

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
    // Bổ sung: Trường password (Hoạt động 1: Bảo mật)
    password: { type: String, required: true }, 

    // Bổ sung: Trường role (Hoạt động 3)
    role: { type: String, default: 'user' }, 
    
    // Bổ sung: Trường avatar (Hoạt động 2: Cập nhật Profile)
    avatar: { type: String, default: 'https://placehold.co/150x150/EEEEEE/333333/png?text=AV' }, 

}, { timestamps: true }); 

module.exports = mongoose.model("User", userSchema); 
