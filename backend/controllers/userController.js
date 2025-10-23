const User = require("../models/User");

// GET /api/users
exports.list = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { next(e); }
};

// POST /api/users
exports.create = async (req, res, next) => {
  try {
    const { name, email } = req.body || {};
    if (!name?.trim() || !email?.trim())
      return res.status(400).json({ message: "Name và email là bắt buộc" });

    const created = await User.create({ name: name.trim(), email: email.trim() });
    res.status(201).json(created);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Email đã tồn tại" });
    next(e);
  }
};

// PUT /api/users/:id
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = {};
    if (typeof req.body?.name === "string") payload.name = req.body.name.trim();
    if (typeof req.body?.email === "string") payload.email = req.body.email.trim();
    if (!Object.keys(payload).length)
      return res.status(400).json({ message: "Không có dữ liệu cập nhật" });

    const updated = await User.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(updated);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Email đã tồn tại" });
    next(e);
  }
};

// DELETE /api/users/:id
exports.remove = async (req, res, next) => {
  try {
    const del = await User.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
