import React, { useState } from "react";
import axios from "axios";

import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";


// ======================================================
// BACKEND URL
// ======================================================

const API_URL = "http://localhost:5001";


// ======================================================
// AUTH COMPONENT
// ======================================================

export default function Auth({
  onLogin,
  onBack,
}) {

  const [isLogin, setIsLogin] = useState(true);

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  // ====================================================
  // LOGIN / SIGNUP
  // ====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (!isLogin && !formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!isLogin && formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }


    setLoading(true);


    try {

      // ================================================
      // SELECT API
      // ================================================

      const endpoint = isLogin
        ? "/api/auth/login"
        : "/api/auth/signup";


      // ================================================
      // API REQUEST
      // ================================================

      const response = await axios.post(
        `${API_URL}${endpoint}`,
        {
          name: formData.name,
          email: formData.email.trim(),
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );


      // ================================================
      // RESPONSE
      // ================================================

      const {
        token,
        user,
      } = response.data;
      console.log("LOGIN USER:", user);


      if (!token || !user) {
        throw new Error(
          "Invalid response from server."
        );
      }


      // ================================================
      // SAVE LOGIN
      // ================================================

      localStorage.setItem(
        "screenerToken",
        token
      );

      localStorage.setItem(
        "screenerUser",
        JSON.stringify(user)
      );


      // ================================================
      // SUCCESS MESSAGE
      // ================================================

      setSuccess(
        isLogin
          ? "Login successful! Opening dashboard..."
          : "Account created successfully! Opening dashboard..."
      );


      // ================================================
      // OPEN DASHBOARD
      // ================================================

      setTimeout(() => {

        onLogin(user);

      }, 600);


    } catch (error) {

      console.error(
        "Authentication Error:",
        error
      );


      // Server response error

      if (error.response) {

        const serverMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Authentication failed.";

        setError(serverMessage);

      }

      // Server not running

      else if (error.request) {

        setError(
          "Backend server se connection nahi ho raha. Check karo server port 5001 par running hai."
        );

      }

      // Other error

      else {

        setError(
          error.message ||
          "Something went wrong."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // ====================================================
  // SWITCH LOGIN / SIGNUP
  // ====================================================

  const switchMode = () => {

    setIsLogin((previous) => !previous);

    setError("");
    setSuccess("");

    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      className="auth-screen"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #f8fafc, #eef2ff)",
        padding: "20px",
        fontFamily:
          "Inter, Arial, sans-serif",
      }}
    >

      <div
        className="auth-card"
        style={{
          background: "#ffffff",
          padding: "38px",
          borderRadius: "22px",
          width: "100%",
          maxWidth: "420px",
          boxShadow:
            "0 25px 60px rgba(15, 23, 42, 0.12)",
          border:
            "1px solid #e2e8f0",
        }}
      >

        {/* ============================================
            BACK BUTTON
        ============================================ */}

        <button
          onClick={onBack}
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            fontSize: "13px",
            marginBottom: "25px",
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>


        {/* ============================================
            HEADER
        ============================================ */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >

          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "15px",
              background:
                "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#fff",
              boxShadow:
                "0 10px 25px rgba(79,70,229,0.25)",
            }}
          >
            <Sparkles size={27} />
          </div>


          <h1
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "26px",
              fontWeight: "800",
            }}
          >
            {isLogin
              ? "Welcome Back"
              : "Create Your Account"}
          </h1>


          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
              marginTop: "8px",
              lineHeight: "1.6",
            }}
          >
            {isLogin
              ? "Sign in to continue your career journey"
              : "Start your AI-powered placement journey"}
          </p>

        </div>


        {/* ============================================
            ERROR
        ============================================ */}

        {error && (

          <div
            style={{
              background: "#fef2f2",
              border:
                "1px solid #fecaca",
              color: "#dc2626",
              padding: "12px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "16px",
              lineHeight: "1.5",
            }}
          >
            ❌ {error}
          </div>

        )}


        {/* ============================================
            SUCCESS
        ============================================ */}

        {success && (

          <div
            style={{
              background: "#f0fdf4",
              border:
                "1px solid #bbf7d0",
              color: "#15803d",
              padding: "12px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "16px",
              lineHeight: "1.5",
            }}
          >
            ✅ {success}
          </div>

        )}


        {/* ============================================
            FORM
        ============================================ */}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >

          {/* NAME */}

          {!isLogin && (

            <div
              style={{
                position: "relative",
              }}
            >

              <User
                size={18}
                color="#94a3b8"
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "14px",
                }}
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                autoComplete="name"
                required
                style={inputStyle}
              />

            </div>

          )}


          {/* EMAIL */}

          <div
            style={{
              position: "relative",
            }}
          >

            <Mail
              size={18}
              color="#94a3b8"
              style={{
                position: "absolute",
                left: "13px",
                top: "14px",
              }}
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              autoComplete="email"
              required
              style={inputStyle}
            />

          </div>


          {/* PASSWORD */}

          <div
            style={{
              position: "relative",
            }}
          >

            <Lock
              size={18}
              color="#94a3b8"
              style={{
                position: "absolute",
                left: "13px",
                top: "14px",
              }}
            />


            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete={
                isLogin
                  ? "current-password"
                  : "new-password"
              }
              required
              style={{
                ...inputStyle,
                paddingRight: "45px",
              }}
            />


            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previous) => !previous
                )
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "9px",
                width: "36px",
                height: "36px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >

              {showPassword ? (
                <EyeOff
                  size={18}
                  color="#94a3b8"
                />
              ) : (
                <Eye
                  size={18}
                  color="#94a3b8"
                />
              )}

            </button>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "4px",
              width: "100%",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              background: loading
                ? "#818cf8"
                : "#4f46e5",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow:
                "0 8px 18px rgba(79,70,229,0.2)",
            }}
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  style={{
                    animation:
                      "spin 1s linear infinite",
                  }}
                />

                Please wait...
              </>
            ) : (
              <>
                {isLogin
                  ? "Sign In"
                  : "Create Account"}

                <ArrowLeft
                  size={16}
                  style={{
                    transform:
                      "rotate(180deg)",
                  }}
                />
              </>
            )}

          </button>

        </form>


        {/* ============================================
            SWITCH
        ============================================ */}

        <div
          style={{
            textAlign: "center",
            marginTop: "23px",
          }}
        >

          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
              margin: 0,
            }}
          >

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            {" "}

            <button
              type="button"
              onClick={switchMode}
              style={{
                border: "none",
                background: "transparent",
                color: "#4f46e5",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "14px",
                padding: 0,
              }}
            >
              {isLogin
                ? "Create one"
                : "Sign in"}
            </button>

          </p>

        </div>


        {/* ============================================
            SECURITY
        ============================================ */}

        <div
          style={{
            marginTop: "25px",
            paddingTop: "18px",
            borderTop:
              "1px solid #eef2f7",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "7px",
            color: "#94a3b8",
            fontSize: "11px",
          }}
        >

          <ShieldCheck size={15} />

          Secure AI Career Platform

        </div>

      </div>


      {/* SPIN ANIMATION */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

    </div>
  );
}


// ======================================================
// INPUT STYLE
// ======================================================

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  height: "48px",
  padding: "12px 12px 12px 42px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  outline: "none",
  fontSize: "14px",
  color: "#0f172a",
  background: "#ffffff",
};