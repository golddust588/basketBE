import express from "express";
import { REGISTER_USER, LOGIN, VERIFY_EMAIL } from "../controllers/user.js";

import {
  registerValidationMiddleware,
  loginValidationMiddleware,
} from "../middlewares/validation.js";
import {
  userRegistrationSchema,
  userLoginSchema,
} from "../validation/userSchema.js";
const router = express.Router();

router.post(
  "/register",
  registerValidationMiddleware(userRegistrationSchema),
  REGISTER_USER
);
router.post("/login", loginValidationMiddleware(userLoginSchema), LOGIN);

// Endpoint to handle email confirmation
router.post("/verify-email", VERIFY_EMAIL);

export default router;
