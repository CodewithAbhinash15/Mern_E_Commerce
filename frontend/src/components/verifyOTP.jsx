import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../pages/Signup.css";


export default function VerifyOTP() {

    const navigate = useNavigate();
    const location = useLocation();


    // ==========================================
    // GET EMAIL FROM SIGNUP PAGE
    // ==========================================

    const email = location.state?.email || "";


    // ==========================================
    // STATES
    // ==========================================

    const [otp, setOtp] = useState("");

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);


    // ==========================================
    // HANDLE OTP INPUT
    // ==========================================

    const handleOTPChange = (e) => {

        const value = e.target.value;

        // Allow only numbers
        const numbersOnly =
            value.replace(/\D/g, "");

        // Maximum 6 digits
        setOtp(
            numbersOnly.slice(0, 6)
        );

    };


    // ==========================================
    // VERIFY OTP
    // ==========================================

    const handleVerifyOTP = async (e) => {

        e.preventDefault();

        setMessage("");


        // ======================================
        // CHECK EMAIL
        // ======================================

        if (!email) {

            setMessage(
                "Email not found. Please signup again."
            );

            return;

        }


        // ======================================
        // CHECK OTP
        // ======================================

        if (otp.length !== 6) {

            setMessage(
                "Please enter a valid 6-digit OTP."
            );

            return;

        }


        try {

            setLoading(true);


            // ==================================
            // API REQUEST
            // ==================================

            const response =
                await api.post(

                    "/auth/verify-otp",

                    {
                        email,
                        otp,
                    }

                );


            // ==================================
            // SUCCESS MESSAGE
            // ==================================

            setMessage(
                response.data.message ||
                "Email verified successfully!"
            );


            // ==================================
            // REDIRECT TO LOGIN
            // ==================================

            setTimeout(() => {

                navigate(
                    "/login",

                    {
                        state: {
                            verified: true,
                        },
                    }

                );

            }, 1500);


        } catch (error) {

            console.error(
                "OTP VERIFY ERROR:",
                error
            );


            setMessage(

                error.response?.data?.message ||

                "OTP verification failed. Please try again."

            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // GO BACK TO SIGNUP
    // ==========================================

    const handleSignupAgain = () => {

        navigate("/signup");

    };


    // ==========================================
    // PAGE UI
    // ==========================================

    return (

        <div className="signup-page">

            <div className="signup-container">


                {/* ================================= */}
                {/* TITLE */}
                {/* ================================= */}

                <h2 className="signup-title">

                    Verify Your Email

                </h2>


                <p
                    style={{
                        textAlign: "center",
                        color: "#6b7280",
                        marginBottom: "20px",
                        lineHeight: "1.6",
                    }}
                >

                    We sent a 6-digit OTP to

                    <br />

                    <strong
                        style={{
                            color: "#2563eb",
                        }}
                    >

                        {email || "your email"}

                    </strong>

                </p>


                {/* ================================= */}
                {/* MESSAGE */}
                {/* ================================= */}

                {message && (

                    <div
                        className="success-message"
                        style={{
                            textAlign: "center",
                        }}
                    >

                        {message}

                    </div>

                )}


                {/* ================================= */}
                {/* OTP FORM */}
                {/* ================================= */}

                <form
                    onSubmit={handleVerifyOTP}
                    className="signup-form"
                >


                    {/* OTP INPUT */}

                    <input

                        type="text"

                        inputMode="numeric"

                        placeholder="Enter 6-digit OTP"

                        value={otp}

                        onChange={handleOTPChange}

                        maxLength="6"

                        className="signup-input"

                        required

                        autoFocus

                    />


                    {/* VERIFY BUTTON */}

                    <button

                        type="submit"

                        className="signup-button"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Verifying..."

                                : "Verify OTP"

                        }

                    </button>


                </form>


                {/* ================================= */}
                {/* SIGNUP AGAIN */}
                {/* ================================= */}

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                    }}
                >

                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "14px",
                        }}
                    >

                        Didn't receive the OTP?

                    </p>


                    <button

                        type="button"

                        onClick={handleSignupAgain}

                        style={{

                            marginTop: "8px",

                            border: "none",

                            background: "transparent",

                            color: "#2563eb",

                            fontWeight: "600",

                            cursor: "pointer",

                        }}

                    >

                        Signup Again

                    </button>

                </div>


            </div>

        </div>

    );

}

