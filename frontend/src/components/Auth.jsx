import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleAuth = async () => {
    setLoading(true)
    setMessage("")

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setMessage(error.message)
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setMessage(error.message)
        else setMessage("✅ Check your email to confirm your account!")
      }
    } catch (err) {
      setMessage("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "24px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>📋</div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1e1b4b" }}>FormSense</h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>AI-Powered Form Analyzer</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          background: "#f3f4f6",
          borderRadius: "12px",
          padding: "4px",
          marginBottom: "24px"
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              background: isLogin ? "white" : "transparent",
              color: isLogin ? "#6366f1" : "#6b7280",
              boxShadow: isLogin ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              background: !isLogin ? "white" : "transparent",
              color: !isLogin ? "#6366f1" : "#6b7280",
              boxShadow: !isLogin ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              padding: "12px 16px",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#6366f1"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              padding: "12px 16px",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#6366f1"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: message.includes("✅") ? "#dcfce7" : "#fee2e2",
            border: `1px solid ${message.includes("✅") ? "#86efac" : "#fca5a5"}`,
            borderRadius: "10px",
            padding: "12px",
            color: message.includes("✅") ? "#166534" : "#dc2626",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            {message}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Please wait..." : isLogin ? "Login →" : "Create Account →"}
        </button>

      </div>
    </div>
  )
}