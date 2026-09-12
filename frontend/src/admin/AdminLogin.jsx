
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./AdminLogin.css";

export default function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

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
    // ADMIN LOGIN
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response = await api.post(
                "/auth/login",
                {
                    email: form.email.trim(),
                    password: form.password,
                }
            );

            console.log(
                "ADMIN LOGIN RESPONSE:",
                response.data
            );

            const { token, user } = response.data;

            // =========================
            // CHECK RESPONSE
            // =========================

            if (!token || !user) {
                setMessage(
                    "Invalid login response from server."
                );
                return;
            }

            // =========================
            // CHECK ADMIN ROLE
            // =========================

            if (user.role !== "admin") {
                setMessage(
                    "Access denied. This account is not an admin."
                );
                return;
            }

            // =========================
            // SAVE TOKEN
            // =========================

            localStorage.setItem(
                "token",
                token
            );

            // =========================
            // SAVE USER
            // =========================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            setMessage(
                "Admin login successful!"
            );

            // =========================
            // REDIRECT
            // =========================

            setTimeout(() => {
                navigate("/admin");
            }, 800);

        } catch (error) {
            console.error(
                "ADMIN LOGIN ERROR:",
                error
            );

            console.log(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setMessage(
                error.response?.data?.message ||
                error.message ||
                "Admin login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">

            <div className="admin-login-container">

                <div className="admin-login-logo">
                    🛒
                </div>

                <h1>
                    Admin Login
                </h1>

                <p className="admin-login-subtitle">
                    Sign in to manage your store
                </p>

                {message && (
                    <div
                        className={
                            message.includes("successful")
                                ? "admin-success"
                                : "admin-error"
                        }
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="admin-input-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter admin email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="admin-input-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "👑 Login as Admin"
                        }
                    </button>

                </form>

                <button
                    className="back-user-login"
                    onClick={() => navigate("/login")}
                >
                    ← User Login
                </button>

            </div>

        </div>
    );
}

