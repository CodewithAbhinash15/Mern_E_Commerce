import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Signup.css";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // =========================
    // SHOW / HIDE PASSWORD
    // =========================

    const [showPassword, setShowPassword] = useState(false);

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // LOGIN
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMsg("");

            // =========================
            // LOGIN API
            // =========================

            const response = await api.post(
                "/auth/login",
                form
            );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );

            const user = response.data.user;

            // =========================
            // ADMIN CHECK
            // =========================

            if (user?.role === "admin") {
                setMsg(
                    "Please use the Admin Login page."
                );

                // Do not save admin
                // token in user login
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                return;
            }

            // =========================
            // SAVE USER TOKEN
            // =========================

            localStorage.setItem(
                "token",
                response.data.token
            );

            // =========================
            // SAVE USER
            // =========================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            setMsg(
                "Login successful!"
            );

            // =========================
            // REDIRECT USER
            // =========================

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            console.error(
                "LOGIN ERROR:",
                error
            );

            setMsg(
                error.response
                    ?.data?.message ||
                "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // PAGE
    // =========================

    return (
        <div className="signup-page">

            <div className="signup-container">

                <h2 className="signup-title">
                    User Login
                </h2>

                {/* MESSAGE */}

                {msg && (
                    <div
                        className={
                            msg.includes("successful")
                                ? "success-message"
                                : "error-message"
                        }
                    >
                        {msg}
                    </div>
                )}

                {/* LOGIN FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="signup-form"
                >

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

                        {/* SHOW / HIDE PASSWORD */}

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

                    {/* FORGOT PASSWORD */}

                    <p
                        onClick={() =>
                            navigate(
                                "/forgot-password"
                            )
                        }
                        style={{
                            textAlign: "right",
                            color: "#2563eb",
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginTop: "5px",
                            marginBottom: "5px",
                        }}
                    >
                        Forgot Password?
                    </p>

                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {/* ========================= */}
                {/* SIGNUP */}
                {/* ========================= */}

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "15px",
                    }}
                >
                    Don't have an account?{" "}

                    <span
                        onClick={() =>
                            navigate("/signup")
                        }
                        style={{
                            color: "#2563eb",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Signup
                    </span>

                </p>

                {/* ========================= */}
                {/* ADMIN LOGIN */}
                {/* ========================= */}

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                    }}
                >
                    👑 Admin?{" "}

                    <span
                        onClick={() =>
                            navigate(
                                "/admin/login"
                            )
                        }
                        style={{
                            color: "#dc2626",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Admin Login
                    </span>

                </p>

            </div>

        </div>
    );
}

