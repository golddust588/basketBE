import express from "express";
import auth from "../middlewares/auth.js";
import {
  REGISTER_USER,
  LOGIN,
  VERIFY_EMAIL,
  IS_USER_LOGGED_IN,
} from "../controllers/user.js";

import {
  registerValidationMiddleware,
  loginValidationMiddleware,
} from "../middlewares/validation.js";
import {
  userRegistrationSchema,
  userLoginSchema,
} from "../validation/userSchema.js";
const router = express.Router();

router.get("/is-user-logged-in", auth, IS_USER_LOGGED_IN);

router.post(
  "/register",
  registerValidationMiddleware(userRegistrationSchema),
  REGISTER_USER
);
router.post("/login", loginValidationMiddleware(userLoginSchema), LOGIN);

// Endpoint to handle email confirmation
router.post("/verify-email", VERIFY_EMAIL);

export default router;
