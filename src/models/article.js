import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
  article_title: { type: String, required: true },
  article_text: { type: String },
  imageName: { type: String, required: true },
  imageUrl: { type: String },
  caption: { type: String, required: true },
  date: { type: String },
  id: { type: String },
  question_id: { type: String, required: true },
  comments: { type: Number },
  gained_likes_number: { type: Number },
  userId: { type: String, required: true },
  isArchived: { type: Boolean, required: true },
});

export default mongoose.model("Article", articleSchema);
