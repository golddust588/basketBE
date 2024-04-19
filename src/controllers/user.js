import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// import createMailTransporter from "../utils/createMailTransporter.js";

const REGISTER_USER = async (req, res) => {
  // Generate a random confirmation token
  const generateToken = () => {
    return crypto.randomBytes(20).toString("hex");
  };

  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ status: "Email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const name = req.body.name;

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    const user = new UserModel({
      email: req.body.email,
      password: hash,
      name: capitalizedName,
      admin: false,
      isBanned: false,
      emailToken: generateToken(),
    });

    // const transporter = createMailTransporter();
    const confirmationLink = `http://${process.env.CLIENT_URL}/verifyEmail/${user.emailToken}`;

    // transporter.sendMail(
    //   {
    //     to: req.body.email,
    //     subject: "Confirm your email address for Krepsinio Forumas acc.",
    //     html: `Click <a href="${confirmationLink}">here</a> to confirm your email address.`,
    //   },
    //   (err, info) => {
    //     if (err) {
    //       console.error("Error sending confirmation email:", err);
    //       res.status(500).json({ message: "Error sending confirmation email" });
    //     } else {
    //       console.log("Confirmation email sent:", info.response);
    //       res.status(200).json({ message: "Confirmation email sent" });
    //     }
    //   }
    // );

    console.log("user", user);
    console.log("confirmation link", confirmationLink);

    const response = await user.save();

    return res.status(201).json({
      status: "User saved",
      name: user.name,
      user_id: user._id,
      response: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "Something went wrong" });
  }
};

const VERIFY_EMAIL = async (req, res) => {
  try {
    const emailToken = req.body.emailToken;
    console.log("emailtoken", emailToken);
    if (!emailToken) return res.status(404).json("EmailToken not found...");
    const user = await UserModel.findOne({ emailToken });
    if (user) {
      user.emailToken = null;
      user.isVerified = true;

      const response = await user.save();

      const jwt_token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "12h" },
        { algorithm: "RS256" }
      );

      const jwt_refresh_token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        { algorithm: "RS256" }
      );

      return res.status(200).json({
        status: "User registered",
        name: user.name,
        user_id: user._id,
        response: response,
        jwt_token: jwt_token,
        jwt_refresh_token: jwt_refresh_token,
        isVerified: user.isVerified,
      });
    } else
      return res.status(404).json("Email verification failed, invalid token!");
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const LOGIN = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({ message: "Bad authentication" });
  }

  bcrypt.compare(req.body.password, user.password, (err, isPasswordMatch) => {
    if (!isPasswordMatch || err) {
      return res.status(401).json({ message: "Bad authentication" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    const jwt_token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      { algorithm: "RS256" }
    );

    const jwt_refresh_token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      { algorithm: "RS256" }
    );

    return res.status(200).json({
      message: "Login successful",
      name: user.name,
      user_id: user._id,
      jwt_token: jwt_token,
      jwt_refresh_token: jwt_refresh_token,
    });
  });
};

const IS_USER_LOGGED_IN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });

    if (user) {
      return res.status(200).json({ message: true });
    } else {
      return res.status(401).json({ message: "Bad authentication" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

export { REGISTER_USER, VERIFY_EMAIL, LOGIN, IS_USER_LOGGED_IN };
