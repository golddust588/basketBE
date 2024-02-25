import AnswerModel from "../models/answer.js";
import QuestionModel from "../models/question.js";

const INSERT_ANSWER = async (req, res) => {
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

    const answer = new AnswerModel({
      answer_text: req.body.answer_text,
      date: formattedDateTime,
      gained_likes_number: 0,
      question_id: req.params.id,
      user_id: req.body.userId,
    });

    const response = await answer.save();

    answer.id = answer._id;

    const question = await QuestionModel.findOne({ _id: req.params.id });

    question.answers.push(answer.id);
    await question.save();

    return res.status(201).json({ response: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "Something went wrong" });
  }
};

const GET_ALL_QUESTION_ANSWERS = async (req, res) => {
  try {
    const answers = await AnswerModel.find({ question_id: req.params.id }).sort(
      { date: "asc" }
    );

    return res.status(200).json({ answers: answers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const DELETE_ANSWER = async (req, res) => {
  try {
    const answer = await AnswerModel.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (req.body.userId === answer.user_id) {
      const response = await AnswerModel.deleteOne({ _id: req.params.id });

      answer.id = answer._id;
      const question = await QuestionModel.findOne({ _id: answer.question_id });
      console.log(question);
      question.answers = question.answers.filter(
        (answerId) => answerId !== answer.id
      );
      await question.save();

      return res.status(200).json({ response: response });
    } else {
      return res.status(403).json({
        message:
          "Unauthorized: User does not have permission to delete this answer",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const UPVOTE_ANSWER = async (req, res) => {
  try {
    const answer = await AnswerModel.findById(req.params.id);
    answer.gained_likes_number += 1;

    const response = await answer.save();

    res.status(200).json({
      message: response,
      gained_likes_number: answer.gained_likes_number,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const DOWNVOTE_ANSWER = async (req, res) => {
  try {
    const answer = await AnswerModel.findById(req.params.id);
    answer.gained_likes_number -= 1;

    const response = await answer.save();

    res.status(200).json({
      message: response,
      gained_likes_number: answer.gained_likes_number,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export {
  INSERT_ANSWER,
  GET_ALL_QUESTION_ANSWERS,
  DELETE_ANSWER,
  UPVOTE_ANSWER,
  DOWNVOTE_ANSWER,
};
