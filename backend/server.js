require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());              // mở CORS cho dễ test
app.use(express.json());

// Kết nối Mongo
const MONGO_URI = process.env.MONGO_URI ||
  "mongodb+srv://minhkhang310304_db_user:khang3103@cluster0.wwepwir.mongodb.net/groupDB?retryWrites=true&w=majority";

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("✅ MongoDB:", mongoose.connection.host);

    app.use("/api/users", require("./routes/user"));

    app.get("/health", async (_req, res) => {
      try { await mongoose.connection.db.admin().ping(); res.json({ mongo: "ok" }); }
      catch (e) { res.status(500).json({ mongo: "down", error: e.message }); }
    });

    // middleware bắt lỗi (đặt sau routes)
    app.use((err, _req, res, _next) => {
      console.error("❌ Error:", err);
      res.status(err.status || 500).json({ message: err.message || "Server error" });
    });

    const PORT = Number(process.env.PORT) || 3001;
    app.listen(PORT, () => console.log(`🚀 Backend http://127.0.0.1:${PORT}`));
  } catch (e) {
    console.error("❌ Lỗi Mongo:", e.name, e.message);
    process.exit(1);
  }
})();
