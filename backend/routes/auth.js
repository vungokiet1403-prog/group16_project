const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { auth } = require("../middleware/auth");
const ctl = require("../controllers/auth.controller");
const cloudinary = require("../services/cloudinary");

router.post("/signup", ctl.signup);
router.post("/login", ctl.login);
router.get("/me", auth, ctl.me);
router.put("/me", auth, ctl.updateMe);

router.post("/forgot-password", ctl.forgotPassword);
router.post("/reset-password", ctl.resetPassword);

// Upload avatar -> trả về url rồi client gọi PUT /me để lưu
router.post("/upload-avatar", auth, upload.single("file"), async (req,res)=>{
  if(!req.file) return res.status(400).json({message:"No file"});
  const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const up = await cloudinary.uploader.upload(b64, { folder: "avatars" });
  res.json({url: up.secure_url});
});

module.exports = router;
