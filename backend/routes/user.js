const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// GET /api/users  (admin)
router.get("/", auth, requireRole("admin"), async (_req, res) => {
  const users = await User.find({}, "name email role avatarUrl createdAt");
  res.json(users);
});

// PUT /api/users/:id  (admin chỉnh sửa)
router.put("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password, newPassword } = req.body || {};

    const updates = {};
    if (name)  updates.name  = String(name).trim();
    if (email) updates.email = String(email).trim().toLowerCase();
    if (role)  updates.role  = String(role).toLowerCase(); // 'user' | 'admin'

    // chấp nhận gửi 'password' hoặc 'newPassword' từ FE
    const pw = (newPassword ?? password) && String(newPassword ?? password).trim();
    if (pw) updates.password = await bcrypt.hash(pw, 10);

    const u = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("name email role avatarUrl");

    if (!u) return res.status(404).json({ message: "User not found" });
    res.json(u);
  } catch (e) {
    if (e?.code === 11000) return res.status(400).json({ message: "Email đã tồn tại" });
    res.status(500).json({ message: e.message || "Server error" });
  }
});

// DELETE /api/users/:id  (admin hoặc tự xóa)
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const isSelf = String(req.user._id) === id;
  if (!isSelf && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  await User.findByIdAndDelete(id);
  res.json({ message: "Deleted" });
});

module.exports = router;
