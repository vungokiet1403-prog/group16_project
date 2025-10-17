const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import model User
const User = require("./database/user"); // chữ thường nếu file là user.js

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MongoDB Atlas
mongoose.connect(
  "mongodb+srv://minhkhang310304_db_user:khang3103@cluster0.wwepwir.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0"
)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Log trạng thái connection
mongoose.connection.on("connected", () => console.log("MongoDB connected ✅"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error ❌:", err));
mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected ⚠️"));

// Middleware log request
app.use((req, res, next) => {
  console.log(`\n⏩ ${req.method} ${req.url} được gọi`);
  console.log("Request body:", req.body);
  next();
});

// Route test
app.get("/", (req, res) => {
  res.send("Server đang hoạt động ✅");
});

// GET danh sách user
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    console.log("GET /users result:", users);
    res.json(users);
  } catch (err) {
    console.error("Lỗi GET /users:", err);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu người dùng" });
  }
});

// POST thêm user mới
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Vui lòng cung cấp cả name và email" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    console.log("User mới đã được thêm:", newUser);

    res.status(201).json({ message: "Thêm người dùng thành công!", data: newUser });
  } catch (err) {
    console.error("Lỗi POST /users:", err);
    res.status(500).json({ error: "Lỗi khi thêm người dùng" });
  }
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại: http://localhost:${PORT}`));
