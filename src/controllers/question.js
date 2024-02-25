import QuestionModel from "../models/question.js";

const INSERT_QUESTION = async (req, res) => {
  try {
    const currentDate = new Date();

    // Get the current date components
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are 0-indexed
    const day = currentDate.getDate().toString().padStart(2, "0");

    // Get the current time components
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");

    // Format the date and time as "yyyy-mm-dd HH:MM"
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    const question = new QuestionModel({
      question_title: req.body.question_title,
      question_text: req.body.question_text,
      date: formattedDateTime,
      gained_likes_number: 0,
      user_id: req.body.userId,
    });

    const response = await question.save();

    return res.status(201).json({ response: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "Something went wrong" });
  }
};

const GET_ALL_QUESTIONS = async (req, res) => {
  try {
    const questions = await QuestionModel.find().sort({ date: -1 });
    return res.status(200).json({ questions: questions });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const GET_ALL_USER_QUESTIONS = async (req, res) => {
  try {
    const questions = await QuestionModel.find({
      user_id: req.params.userId,
    }).sort({ date: -1 });
    return res.status(200).json({ questions: questions });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const GET_QUESTION_BY_ID = async (req, res) => {
  try {
    const question = await QuestionModel.findOne({ _id: req.params.id });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ question: question });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const DELETE_QUESTION = async (req, res) => {
  try {
    const question = await QuestionModel.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (req.body.userId === question.user_id) {
      const response = await QuestionModel.deleteOne({ _id: req.params.id });
      return res.status(200).json({ response: response });
    } else {
      return res.status(403).json({
        message:
          "Unauthorized: User does not have permission to delete this question",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const UPVOTE_QUESTION = async (req, res) => {
  try {
    const question = await QuestionModel.findById(req.params.id);
    question.gained_likes_number += 1;

    const response = await question.save();

    res.status(200).json({
      message: response,
      gained_likes_number: question.gained_likes_number,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const DOWNVOTE_QUESTION = async (req, res) => {
  try {
    const question = await QuestionModel.findById(req.params.id);
    question.gained_likes_number -= 1;

    const response = await question.save();

    res.status(200).json({
      message: response,
      gained_likes_number: question.gained_likes_number,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export {
  INSERT_QUESTION,
  GET_ALL_QUESTIONS,
  GET_ALL_USER_QUESTIONS,
  GET_QUESTION_BY_ID,
  DELETE_QUESTION,
  UPVOTE_QUESTION,
  DOWNVOTE_QUESTION,
};
