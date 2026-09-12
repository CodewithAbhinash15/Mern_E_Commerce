import dotenv from "dotenv";
import nodemailer from "nodemailer";

// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();

// ==========================================
// CHECK ENV VARIABLES
// ==========================================

console.log(
    "EMAIL USER EXISTS:",
    !!process.env.EMAIL_USER
);

console.log(
    "EMAIL PASS EXISTS:",
    !!process.env.EMAIL_PASS
);

// ==========================================
// CREATE EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,

    },

});

// ==========================================
// VERIFY EMAIL CONFIGURATION
// ==========================================

transporter.verify((error, success) => {

    if (error) {

        console.error(
            "EMAIL CONFIGURATION ERROR:",
            error.message
        );

    } else {

        console.log(
            "EMAIL SERVER READY"
        );

    }

});

// ==========================================
// SEND OTP EMAIL
// ==========================================

export const sendOTPEmail = async (
    email,
    name,
    otp
) => {

    try {

        const info = await transporter.sendMail({

            from: `"MyStore" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "Verify Your Email - MyStore",

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 30px;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    background: #ffffff;
                ">

                    <h2 style="
                        color: #2563eb;
                        text-align: center;
                    ">
                        Email Verification
                    </h2>

                    <p style="
                        font-size: 16px;
                        color: #374151;
                    ">
                        Hello <strong>${name}</strong>,
                    </p>

                    <p style="
                        font-size: 15px;
                        color: #6b7280;
                        line-height: 1.6;
                    ">
                        Thank you for creating an account
                        with MyStore.
                    </p>

                    <p style="
                        font-size: 15px;
                        color: #374151;
                    ">
                        Please use the following OTP
                        to verify your email address:
                    </p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        text-align: center;
                        padding: 18px;
                        margin: 25px 0;
                        background: #eff6ff;
                        color: #2563eb;
                        border-radius: 10px;
                    ">

                        ${otp}

                    </div>

                    <p style="
                        font-size: 14px;
                        color: #6b7280;
                    ">
                        This OTP will expire in
                        <strong>10 minutes</strong>.
                    </p>

                    <p style="
                        font-size: 14px;
                        color: #dc2626;
                    ">
                        ⚠️ Do not share this OTP with anyone.
                    </p>

                    <hr style="
                        border: none;
                        border-top: 1px solid #e5e7eb;
                        margin: 25px 0;
                    ">

                    <p style="
                        font-size: 12px;
                        text-align: center;
                        color: #9ca3af;
                    ">
                        © MyStore. All rights reserved.
                    </p>

                </div>

            `,

        });

        console.log(
            "OTP EMAIL SENT SUCCESSFULLY TO:",
            email
        );

        console.log(
            "MESSAGE ID:",
            info.messageId
        );

        return info;

    } catch (error) {

        console.error(
            "EMAIL SENDING ERROR:",
            error.message
        );

        throw error;

    }

};

