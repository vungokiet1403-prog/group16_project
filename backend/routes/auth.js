const router = require("express").Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const { auth } = require("../middleware/auth");
const ctl = require("../controllers/auth.controller");
const cloudinary = require("../services/cloudinary");

router.post("/signup", ctl.signup);
router.post("/login",  ctl.login);
router.get ("/me",    auth, ctl.me);
router.put ("/me",    auth, ctl.updateMe);
router.post("/forgot-password", ctl.forgotPassword);
router.post("/reset-password",  ctl.resetPassword);

// ⬇ Upload avatar
router.post("/upload-avatar", auth, upload.single("file"), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({message:"No file"});
    const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const up = await cloudinary.uploader.upload(b64, { folder: "avatars" });
    return res.json({ url: up.secure_url });
  }catch(e){
    console.error("Cloudinary upload error:", e?.message || e);
    return res.status(500).json({ message: e?.message || "Upload failed" });
  }
});

module.exports = router;
