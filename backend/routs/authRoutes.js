import express from "express";

import {
  SignupUser,
  LoginUser,
  verifyOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Signup
router.post("/signup", SignupUser);

// Verify signup OTP
router.post("/verify-otp", verifyOTP);

// Login
router.post("/login", LoginUser);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

export default router;