import express from "express";
import { REGISTER_USER, LOGIN } from "../controllers/user.js";

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

export default router;
