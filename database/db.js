// db.js
const mongoose = require("mongoose");

const uri = "mongodb+srv://minhkhang310304_db_user:khang3103@cluster0.wwepwir.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));
