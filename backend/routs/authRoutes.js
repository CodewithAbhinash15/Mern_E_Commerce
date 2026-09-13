import express from "express";

import {
  SignupUser,
  LoginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Signup
router.post("/signup", SignupUser);

// Login
router.post("/login", LoginUser);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

export default router;