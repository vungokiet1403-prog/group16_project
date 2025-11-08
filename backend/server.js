// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

/* ===== CORS ===== */
const DEFAULT_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];
const ORIGINS =
  (process.env.CORS_ORIGINS?.split(",").map(s => s.trim()).filter(Boolean)) ||
  DEFAULT_ORIGINS;
app.use(
  cors({
    origin: ORIGINS,
    credentials: true,
  })
);
app.options("*", cors({ origin: ORIGINS, credentials: true })); // preflight

/* ===== Parsers ===== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ===== Static uploads (nếu có upload avatar) ===== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===== Mongo ===== */
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://minhkhang310304_db_user:khang3103@cluster0.wwepwir.mongodb.net/groupDB?retryWrites=true&w=majority";

/* ===== Start ===== */
(async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("✅ MongoDB:", mongoose.connection.host);

    /* ===== Routes chính ===== */
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/users", require("./routes/user"));

    /* ===== Dev seed: tạo user đăng nhập chắc chắn ===== */
    const User = require("./models/User");
    app.post("/dev/force-user", async (req, res) => {
      try {
        const { email, password, name = "Admin", role = "admin" } = req.body || {};
        const e = String(email || "").toLowerCase().trim();
        const r = String(role || "user").toLowerCase();
        if (!e || !password) return res.status(400).json({ message: "Thiếu email/password" });
        let u = await User.findOne({ email: e }).select("+password");
        if (!u) u = await User.create({ email: e, name, role: r, password });
        else {
          u.name = name;
          u.role = r;
          u.password = password; // pre('save') sẽ hash
          await u.save();
        }
        res.json({ ok: true, email: e, role: u.role });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    /* ===== Health ===== */
    app.get("/health", async (_req, res) => {
      try {
        await mongoose.connection.db.admin().ping();
        res.json({ mongo: "ok" });
      } catch (e) {
        res.status(500).json({ mongo: "down", error: e.message });
      }
    });

    /* ===== 404 sau cùng ===== */
    app.use((_req, res) => res.status(404).json({ message: "Not found" }));

    /* ===== Error handler CUỐI CÙNG ===== */
    app.use((err, _req, res, _next) => {
      console.error("❌ Error:", err);
      res.status(err.status || 500).json({ message: err.message || "Server error" });
    });

    const PORT = Number(process.env.PORT) || 3001;
    app.listen(PORT, () => console.log(`🚀 Backend http://127.0.0.1:${PORT}`));
  } catch (e) {
    console.error("❌ Lỗi Mongo:", e);
    process.exit(1);
  }
})();

/* Tránh crash do promise chưa bắt */
process.on("unhandledRejection", err => console.error("UNHANDLED REJECTION:", err));
process.on("uncaughtException", err => console.error("UNCAUGHT EXCEPTION:", err));
