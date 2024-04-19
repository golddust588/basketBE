import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  question_title: { type: String, required: true },
  question_text: { type: String },
  date: { type: String, required: true },
  gained_likes_number: { type: Number, required: true },
  id: { type: String },
  user_id: { type: String, required: true },
  answers: { type: Array, required: true },
  userName: { type: String },
  isArchived: { type: Boolean, required: true, default: false },
});

export default mongoose.model("Question", questionSchema);
