import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/sendEmail.js";


// ==========================================
// SIGNUP USER + SEND OTP
// ==========================================

export const SignupUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const existingUser =
            await User.findOne({
                email: normalizedEmail,
            });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const otp = Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();

        const otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );

        const newUser =
            await User.create({

                name: name.trim(),

                email: normalizedEmail,

                password: hashedPassword,

                role: "user",

                isVerified: false,

                otp,

                otpExpires,

            });

        try {

            await sendOTPEmail(
                newUser.email,
                newUser.name,
                otp
            );

        } catch (emailError) {

            console.error(
                "EMAIL ERROR:",
                emailError
            );

            await User.findByIdAndDelete(
                newUser._id
            );

            return res.status(500).json({

                message:
                    "Failed to send OTP email. Please try again.",

            });
        }

        return res.status(201).json({

            message:
                "OTP sent successfully. Please check your email.",

            email:
                newUser.email,

        });

    } catch (error) {

        console.error(
            "SIGNUP ERROR:",
            error
        );

        if (error.code === 11000) {

            return res.status(400).json({

                message:
                    "Email already registered",

            });
        }

        return res.status(500).json({

            message:
                "Signup failed. Please try again.",

        });
    }
};


// ==========================================
// VERIFY SIGNUP OTP
// ==========================================

export const verifyOTP = async (req, res) => {

    try {

        const {
            email,
            otp,
        } = req.body;

        if (!email || !otp) {

            return res.status(400).json({

                message:
                    "Email and OTP are required",

            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const user =
            await User.findOne({

                email: normalizedEmail,

            });

        if (!user) {

            return res.status(404).json({

                message:
                    "User not found",

            });
        }

        if (user.isVerified) {

            return res.status(400).json({

                message:
                    "Email is already verified",

            });
        }

        if (
            !user.otpExpires ||
            user.otpExpires < new Date()
        ) {

            return res.status(400).json({

                message:
                    "OTP has expired. Please signup again.",

            });
        }

        if (user.otp !== otp) {

            return res.status(400).json({

                message:
                    "Invalid OTP",

            });
        }

        user.isVerified = true;

        user.otp = null;

        user.otpExpires = null;

        await user.save();

        return res.status(200).json({

            message:
                "Email verified successfully. You can now login.",

        });

    } catch (error) {

        console.error(
            "VERIFY OTP ERROR:",
            error
        );

        return res.status(500).json({

            message:
                "OTP verification failed",

        });
    }
};


// ==========================================
// LOGIN USER / ADMIN
// ==========================================

export const LoginUser = async (req, res) => {

    try {

        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required",

            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const existingUser =
            await User.findOne({

                email: normalizedEmail,

            });

        if (!existingUser) {

            return res.status(400).json({

                message:
                    "User not found",

            });
        }

        if (!existingUser.isVerified) {

            return res.status(403).json({

                message:
                    "Please verify your email before login",

            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                existingUser.password
            );

        if (!passwordMatch) {

            return res.status(400).json({

                message:
                    "Invalid email or password",

            });
        }

        const token = jwt.sign(

            {

                userId:
                    existingUser._id,

                email:
                    existingUser.email,

                role:
                    existingUser.role,

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d",

            }

        );

        return res.status(200).json({

            message: "Login successful",

            token,

            user: {

                id: existingUser._id,

                name: existingUser.name,

                email: existingUser.email,

                role: existingUser.role,

            },

        });

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        return res.status(500).json({

            message:
                "Server error. Please try again.",

        });
    }
};


// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================

export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({

                message:
                    "Email is required",

            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const user =
            await User.findOne({
                email: normalizedEmail,
            });

        if (!user) {

            return res.status(404).json({

                message:
                    "No account found with this email",

            });
        }

        // Generate 6 digit OTP
        const otp =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();

        // OTP valid for 10 minutes
        const otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );

        user.otp = otp;

        user.otpExpires = otpExpires;

        await user.save();

        // Send OTP to email
        await sendOTPEmail(
            user.email,
            user.name,
            otp
        );

        return res.status(200).json({

            message:
                "Password reset OTP sent successfully. Please check your email.",

            email:
                user.email,

        });

    } catch (error) {

        console.error(
            "FORGOT PASSWORD ERROR:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to send password reset OTP",

        });
    }
};


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (req, res) => {

    try {

        const {
            email,
            otp,
            newPassword,
        } = req.body;

        if (
            !email ||
            !otp ||
            !newPassword
        ) {

            return res.status(400).json({

                message:
                    "Email, OTP and new password are required",

            });
        }

        if (newPassword.length < 6) {

            return res.status(400).json({

                message:
                    "Password must be at least 6 characters",

            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const user =
            await User.findOne({
                email: normalizedEmail,
            });

        if (!user) {

            return res.status(404).json({

                message:
                    "User not found",

            });
        }

        // Check OTP expiry
        if (
            !user.otpExpires ||
            user.otpExpires < new Date()
        ) {

            return res.status(400).json({

                message:
                    "OTP has expired. Please request a new OTP.",

            });
        }

        // Check OTP
        if (user.otp !== otp) {

            return res.status(400).json({

                message:
                    "Invalid OTP",

            });
        }

        // Hash new password
        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        user.password =
            hashedPassword;

        // Clear OTP after successful reset
        user.otp = null;

        user.otpExpires = null;

        await user.save();

        return res.status(200).json({

            message:
                "Password reset successfully. You can now login.",

        });

    } catch (error) {

        console.error(
            "RESET PASSWORD ERROR:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to reset password",

        });
    }
};

