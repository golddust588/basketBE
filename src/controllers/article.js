import ArticleModel from "../models/article.js";
import QuestionModel from "../models/question.js";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import dotenv from "dotenv";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import jwt from "jsonwebtoken";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const INSERT_ARTICLE = async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);
  console.log("region", region);
  req.file.buffer;

  const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");
  try {
    const file = req.file;
    // const caption = req.body.caption;

    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 500, width: 700, fit: "cover" })
      .toBuffer();

    // Configure the upload details to send to S3
    const fileName = generateFileName();
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: file.mimetype,
    };

    // Send the upload to S3
    await s3Client.send(new PutObjectCommand(uploadParams));

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

    const jwt_token = req.headers.authorization;

    jwt.verify(jwt_token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Must be logged in" });
      }

      req.body.userId = decoded.userId;
    });

    let article_title = req.body.article_title;

    // If article_title is an empty string, fetch it from the QuestionModel
    if (article_title === "") {
      const question = await QuestionModel.findOne({
        _id: req.body.question_id,
      });
      console.log("question", question);
      if (question) {
        article_title = question.question_title;
      }
    }
    console.log("req.body", req.body);
    console.log("article_title", article_title);

    const article = new ArticleModel({
      article_title: article_title,
      question_id: req.body.question_id,
      imageName: fileName,
      caption: req.body.caption,
      // article_text: req.body.article_text,
      date: formattedDateTime,

      // gained_likes_number: 0,
      userId: req.body.userId,
      isArchived: false,
    });

    // Save the image name to the database. Any other req.body data can be saved here too but we don't need any other image data.
    // const post = await prisma.posts.create({
    //   data: {
    //     imageName,
    //     caption,
    //   }
    // })

    const response = await article.save();

    return res.status(201).json({ response: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "Something went wrong" });
  }
};

const GET_ALL_ARTICLES = async (req, res) => {
  try {
    const articles = await ArticleModel.find().sort({ date: -1 });

    for (let article of articles) {
      // For each post, generate a signed URL and save it to the post object
      const question = await QuestionModel.findOne({
        _id: article.question_id,
      });
      if (question) {
        article.gained_likes_number = question.gained_likes_number;
        article.comments = question.answers.length;
      }
      // Generate signed URL for the article's image
      article.imageUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: article.imageName,
        })
        // { expiresIn: 60 } // 60 seconds
      );
    }

    console.log("articles", articles);

    return res.status(200).json({ articles: articles });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// const GET_QUESTION_BY_ID = async (req, res) => {
//   try {
//     const question = await QuestionModel.findOne({ _id: req.params.id });

//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     return res.status(200).json({ question: question });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// const DELETE_QUESTION = async (req, res) => {
//   try {
//     const question = await QuestionModel.findById(req.params.id);

//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     if (req.body.userId === question.user_id) {
//       const response = await QuestionModel.deleteOne({ _id: req.params.id });
//       return res.status(200).json({ response: response });
//     } else {
//       return res.status(403).json({
//         message:
//           "Unauthorized: User does not have permission to delete this question",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

export { INSERT_ARTICLE, GET_ALL_ARTICLES };
