const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = new Schema({
  name: { type: String, default: "" },
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum:["user","admin"], default:"user" },
  avatarUrl: { type: String, default: "" },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

UserSchema.methods.setPassword = async function(pw){
  this.passwordHash = await bcrypt.hash(pw, 10);
};
UserSchema.methods.checkPassword = function(pw){
  return bcrypt.compare(pw, this.passwordHash);
};
module.exports = model("User", UserSchema);
