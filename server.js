const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // ✅ Bắt buộc cho Đăng ký/Đăng nhập an toàn
const jwt = require("jsonwebtoken"); // ✅ Bắt buộc cho Xác thực Token

// Import model User (Đã đồng bộ với cấu trúc file: ./database/user.js)
const User = require("./database/user.js"); 

const app = express();
app.use(express.json());
app.use(cors());

// ✅ CẦN THAY ĐỔI: Sử dụng biến môi trường cho Secret Key
const JWT_SECRET = "CHUOI_SECRET_CHO_DU_AN_NHOM_PHUC_TAP_VA_KHONG_AI_BIET"; 

// Kết nối MongoDB Atlas (Giữ nguyên)
mongoose.connect(
  "mongodb+srv://minhkhang310304_db_user:khang3103@cluster0.wwepwir.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    serverSelectionTimeoutMS: 10000, 
  }
)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Log trạng thái connection
mongoose.connection.on("connected", () => console.log("🔗 MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("💥 MongoDB connection error:", err));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected"));

// Middleware log request
app.use((req, res, next) => {
  console.log(`\n➡️ ${req.method} ${req.url} được gọi`);
  console.log("📦 Request body:", req.body);
  next();
});

// Route test
app.get("/", (req, res) => {
  res.send("✅ Server đang hoạt động bình thường!");
});

// --- MIDDLEWARE BẢO VỆ ROUTE (HOẠT ĐỘNG 2 & 3) ---
const protect = (req, res, next) => {
    let token;
    // Lấy token từ header Authorization (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Giải mã token và lấy ID người dùng
            const decoded = jwt.verify(token, JWT_SECRET);
            // Gán user ID vào request để các route sau có thể dùng
            req.userId = decoded.id; 
            next();
        } catch (error) {
            console.error("❌ Token Verification Error:", error.message);
            res.status(401).json({ error: "Không được ủy quyền, token không hợp lệ" });
        }
    }

    if (!token) {
        res.status(401).json({ error: "Không được ủy quyền, thiếu token" });
    }
};

// ----------------------------------------------------------------
// HOẠT ĐỘNG 1: AUTHENTICATION (ĐĂNG KÝ & ĐĂNG NHẬP)
// ----------------------------------------------------------------

// ROUTE ĐĂNG KÝ (SIGN UP)
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ tên, email và mật khẩu" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    // MÃ HÓA MẬT KHẨU (BCRYPT)
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Lưu mật khẩu đã HASH
    });

    await newUser.save();

    console.log("✅ Đăng ký thành công, user mới:", newUser.email);

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("❌ Lỗi POST /api/auth/signup:", err);
    res.status(500).json({ error: "Lỗi Server khi đăng ký" });
  }
});

// ROUTE ĐĂNG NHẬP (LOGIN)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Vui lòng cung cấp email và mật khẩu" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Thông tin đăng nhập không hợp lệ" });
    }

    // So sánh mật khẩu HASH
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Thông tin đăng nhập không hợp lệ" });
    }

    // TẠO JWT TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Đăng nhập thành công, tạo JWT cho user:", user.email);

    res.json({ 
        message: "Đăng nhập thành công!", 
        token: token, 
        user: { id: user._id, email: user.email, name: user.name, role: user.role, avatar: user.avatar } 
    });

  } catch (err) {
    console.error("❌ Lỗi POST /api/auth/login:", err);
    res.status(500).json({ error: "Lỗi Server khi đăng nhập" });
  }
});


// ----------------------------------------------------------------
// HOẠT ĐỘNG 2: PROFILE MANAGEMENT (CẬP NHẬT PROFILE)
// ----------------------------------------------------------------

// ROUTE LẤY VÀ CẬP NHẬT PROFILE CỦA NGƯỜI DÙNG HIỆN TẠI (Được bảo vệ bằng Middleware `protect`)
app.route("/api/users/profile")
  .get(protect, async (req, res) => {
    // Lấy thông tin user dựa trên ID từ token
    try {
        const user = await User.findById(req.userId).select('-password'); // Loại bỏ mật khẩu
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "Không tìm thấy người dùng" });
        }

    } catch (err) {
        console.error("❌ Lỗi GET /api/users/profile:", err);
        res.status(500).json({ error: "Lỗi Server khi lấy profile" });
    }
  })
  .put(protect, async (req, res) => {
    // Cập nhật thông tin profile (Name, Avatar, Password)
    const { name, avatar, password } = req.body;
    
    try {
        const user = await User.findById(req.userId);

        if (user) {
            user.name = name || user.name;
            user.avatar = avatar || user.avatar;

            if (password) {
                // Nếu cập nhật mật khẩu, phải HASH lại
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                console.log("⚠️ Mật khẩu đã được cập nhật và HASH lại.");
            }

            const updatedUser = await user.save();
            
            // Trả về thông tin user đã cập nhật (không kèm mật khẩu)
            res.json({
                message: "Cập nhật profile thành công!",
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    avatar: updatedUser.avatar,
                    role: updatedUser.role
                }
            });

        } else {
            res.status(404).json({ error: "Không tìm thấy người dùng" });
        }

    } catch (err) {
        console.error("❌ Lỗi PUT /api/users/profile:", err);
        res.status(500).json({ error: "Lỗi Server khi cập nhật profile" });
    }
  });


// ----------------------------------------------------------------
// KHỞI ĐỘNG SERVER     
// ----------------------------------------------------------------
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server chạy tại: http://localhost:${PORT}`));
