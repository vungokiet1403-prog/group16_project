const router = require("express").Router();
const User = require("../models/User");

router.get("/", async (_req,res)=>{ res.json(await User.find().lean()); });
router.post("/", async (req,res)=>{
  const { name, email } = req.body;
  const doc = await User.create({ name, email, passwordHash: "tmp" });
  res.status(201).json(doc);
});
module.exports = router;
