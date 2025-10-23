// backend/routes/profile.js
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { auth } = require("../middleware/auth");
const User = require("../models/User");

// GET /api/profile  -> xem thông tin cá nhân
router.get("/", auth, async (req, res) => {
  const u = await User.findById(req.user.id).select("-passwordHash");
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json(u);
});

// PUT /api/profile  -> cập nhật name / avatar / password (tùy chọn)
router.put("/", auth, async (req, res, next) => {
  try {
    const { name, avatar, password } = req.body;
    const u = await User.findById(req.user.id);
    if (!u) return res.status(404).json({ message: "User not found" });

    if (name) u.name = name;
    if (avatar) u.avatar = avatar; // là URL (từ /auth/upload-avatar) hoặc để nguyên
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      u.passwordHash = await bcrypt.hash(password, salt);
    }
    await u.save();

    res.json({
      message: "updated",
      user: { _id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar },
    });
  } catch (e) { next(e); }
});

module.exports = router;
