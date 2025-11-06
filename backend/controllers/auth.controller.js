const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.signup = async (req,res)=>{
  const {name,email,password} = req.body;
  if(!email || !password) return res.status(400).json({message:"email & password required"});
  const exists = await User.findOne({email});
  if(exists) return res.status(400).json({message:"Email already used"});

  const u = new User({name, email});
  // nếu chưa có admin nào -> user này là admin
  const hasAdmin = await User.exists({ role: "admin" });
  if (!hasAdmin) u.role = "admin";

  await u.setPassword(password);
  await u.save();
  res.json({token: sign(u), user:{id:u._id, name:u.name, email:u.email, role:u.role}});
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u || !(await u.checkPassword(password)))
    return res.status(400).json({ message: "Invalid credentials" });
  res.json({ token: sign(u), user: { id: u._id, name: u.name, email: u.email, role: u.role, avatarUrl: u.avatarUrl } });
};

exports.me = async (req, res) => {
  const u = req.user;
  res.json({ id: u._id, name: u.name, email: u.email, role: u.role, avatarUrl: u.avatarUrl });
};

exports.updateMe = async (req, res) => {
  const u = req.user;
  const { name, password, avatarUrl } = req.body;
  if (name != null) u.name = name;
  if (avatarUrl != null) u.avatarUrl = avatarUrl;
  if (password) await u.setPassword(password);
  await u.save();
  res.json({ message: "Updated", user: { id: u._id, name: u.name, email: u.email, role: u.role, avatarUrl: u.avatarUrl } });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.json({ message: "If email exists, token sent" });
  const token = crypto.randomBytes(20).toString("hex");
  u.resetPasswordToken = token;
  u.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30);
  await u.save();
  res.json({ message: "Reset token generated", token }); // demo
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const u = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!u) return res.status(400).json({ message: "Invalid or expired token" });
  await u.setPassword(newPassword);
  u.resetPasswordToken = undefined;
  u.resetPasswordExpires = undefined;
  await u.save();
  res.json({ message: "Password updated" });
};
