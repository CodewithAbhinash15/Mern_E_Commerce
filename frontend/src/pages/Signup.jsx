import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Signup.css";
import api from "../api/axios";

export default function Signup() {
    const navigate = useNavigate();

    // =========================
    // FORM STATE
    // =========================

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // SHOW / HIDE PASSWORD
    const [showPassword, setShowPassword] = useState(false);

    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // HANDLE SIGNUP
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMsg("");
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/signup",
                form
            );

            console.log(
                "SERVER RESPONSE:",
                response.data
            );

            setMsg(
                response.data.message ||
                "Signup successful!"
            );

            // =========================
            // GO TO LOGIN
            // =========================

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            console.error(
                "SIGNUP ERROR:",
                error
            );

            setMsg(
                error.response?.data?.message ||
                "Signup failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // PAGE UI
    // =========================

    return (
        <div className="signup-page">

            <div className="signup-container">

                <h2 className="signup-title">
                    Create Account
                </h2>

                {/* MESSAGE */}

                {msg && (
                    <div className="success-message">
                        {msg}
                    </div>
                )}

                {/* SIGNUP FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="signup-form"
                >

                    {/* NAME */}

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={form.name}
                        onChange={handleChange}
                        className="signup-input"
                        required
                    />

                    {/* EMAIL */}

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={form.email}
                        onChange={handleChange}
                        className="signup-input"
                        required
                    />

                    {/* PASSWORD */}

                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                        }}
                    >

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            placeholder="Enter Password"
                            value={form.password}
                            onChange={handleChange}
                            className="signup-input"
                            required
                            style={{
                                paddingRight: "50px",
                            }}
                        />

                        <span
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "20px",
                                userSelect: "none",
                            }}
                        >
                            {showPassword
                                ? "🙈"
                                : "👁️"}
                        </span>

                    </div>

                    {/* SUBMIT BUTTON */}

                    <button
                        type="submit"
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Sign Up"}
                    </button>

                </form>

            </div>

        </div>
    );
}