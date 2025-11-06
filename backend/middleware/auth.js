const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req,res,next)=>{
  try{
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if(!token) return res.status(401).json({message:"Missing token"});
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if(!user) return res.status(401).json({message:"Invalid user"});
    req.user = user;
    next();
  }catch(e){ res.status(401).json({message:"Unauthorized"}); }
};

exports.requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
