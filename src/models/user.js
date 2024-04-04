import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false },
  isBanned: { type: Boolean, required: true, default: false },
  isVerified: { type: Boolean, required: true, default: false },
  emailToken: { type: String },
  id: { type: String },
});

export default mongoose.model("User", userSchema);
