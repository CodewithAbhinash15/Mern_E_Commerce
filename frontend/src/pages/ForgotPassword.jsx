import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Signup.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMsg("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const response = await api.post("/auth/forgot-password", {
        email,
      });

      setMsg(response.data.message);

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 1000);
    } catch (error) {
      setMsg(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {msg && <p className="message">{msg}</p>}

        <p
          onClick={() => navigate("/login")}
          style={{
            textAlign: "center",
            color: "#2563eb",
            cursor: "pointer",
            marginTop: "15px",
            fontWeight: "bold",
          }}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;