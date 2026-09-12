import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Signup.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMsg("Email not found. Please start again.");
      return;
    }

    if (!otp.trim()) {
      setMsg("Please enter OTP.");
      return;
    }

    if (!newPassword) {
      setMsg("Please enter new password.");
      return;
    }

    if (newPassword.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setMsg(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
        <h2>Reset Password</h2>

        <p style={{ textAlign: "center", marginBottom: "15px" }}>
          OTP sent to <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ paddingRight: "45px" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ paddingRight: "45px" }}
            />

            <span
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {msg && (
          <p
            className="message"
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {msg}
          </p>
        )}

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

export default ResetPassword;