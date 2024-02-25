import express from "express";
import auth from "../middlewares/auth.js";
import {
  INSERT_ANSWER,
  GET_ALL_QUESTION_ANSWERS,
  DELETE_ANSWER,
  UPVOTE_ANSWER,
  DOWNVOTE_ANSWER,
} from "../controllers/answer.js";

const router = express.Router();

router.get("/question/:id/answers", GET_ALL_QUESTION_ANSWERS);
router.put("/answer/upvote/:id", auth, UPVOTE_ANSWER);
router.put("/answer/downvote/:id", auth, DOWNVOTE_ANSWER);
router.post("/question/:id/answers", auth, INSERT_ANSWER);
router.delete("/answer/:id", auth, DELETE_ANSWER);

export default router;
