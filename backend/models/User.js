import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // =========================
        // USER NAME
        // =========================

        name: {
            type: String,
            required: true,
            trim: true,
        },


        // =========================
        // EMAIL
        // =========================

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,

            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address",
            ],
        },


        // =========================
        // PASSWORD
        // =========================

        password: {
            type: String,
            required: true,
        },


        // =========================
        // EMAIL VERIFICATION
        // =========================

        isVerified: {
            type: Boolean,
            default: false,
        },


        // =========================
        // OTP
        // =========================

        otp: {
            type: String,
            default: null,
        },


        // =========================
        // OTP EXPIRY TIME
        // =========================

        otpExpires: {
            type: Date,
            default: null,
        },


        // =========================
        // USER ROLE
        // =========================

        role: {
            type: String,

            enum: [
                "user",
                "admin",
            ],

            default: "user",
        },

    },

    {
        timestamps: true,
    }
);


const User =
    mongoose.model(
        "User",
        userSchema
    );


export default User;

