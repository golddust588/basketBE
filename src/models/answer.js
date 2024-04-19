import mongoose from "mongoose";

const answerSchema = mongoose.Schema({
  id: { type: String },
  answer_text: { type: String, required: true },
  date: { type: String, required: true },
  gained_likes_number: { type: Number, required: true },
  question_id: { type: String, required: true },
  user_id: { type: String, required: true },
  userName: { type: String },
  isArchived: { type: Boolean, required: true, default: false },
});

export default mongoose.model("Answer", answerSchema);
