import express from "express";
import auth from "../middlewares/auth.js";
import multer from "multer";
import { INSERT_ARTICLE, GET_ALL_ARTICLES } from "../controllers/article.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/articles", GET_ALL_ARTICLES);
router.post("/article", auth, upload.single("image"), INSERT_ARTICLE);

export default router;
