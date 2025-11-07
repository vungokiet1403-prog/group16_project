const router = require("express").Router();
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// GET /api/users  (admin xem danh sách)
router.get("/", auth, requireRole("admin"), async (_req, res) => {
  const users = await User.find({}, "name email role avatarUrl createdAt");
  res.json(users);
});

// DELETE /api/users/:id  (admin được xóa; user tự xóa chính mình)
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
