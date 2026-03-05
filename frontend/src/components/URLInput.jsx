import { useState } from "react"

export default function URLInput({ onAnalyze }) {
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [file, setFile] = useState(null)
  const [mode, setMode] = useState("url")

  const handleSubmit = () => {
    if (mode === "url" && url) onAnalyze({ url })
    else if (mode === "text" && text) onAnalyze({ text })
    else if (mode === "file" && file) onAnalyze({ file })
  }

  const tabs = [
    { id: "url", label: "🔗 Paste URL" },
    { id: "text", label: "📝 Paste Text" },
    { id: "file", label: "📄 Upload Doc" },
  ]

  return (
    <div style={{
      background: "white",
      borderRadius: "20px",
      padding: "32px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      marginBottom: "24px"
    }}>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        background: "#f3f4f6",
        borderRadius: "12px",
        padding: "6px"
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.2s",
              background: mode === tab.id ? "white" : "transparent",
              color: mode === tab.id ? "#6366f1" : "#6b7280",
              boxShadow: mode === tab.id ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* URL Input */}
      {mode === "url" && (
        <input
          type="text"
          placeholder="https://example.gov.in/scheme..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "16px",
            outline: "none",
            transition: "border 0.2s",
            boxSizing: "border-box"
          }}
          onFocus={(e) => e.target.style.borderColor = "#6366f1"}
          onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        />
      )}

      {/* Text Input */}
      {mode === "text" && (
        <textarea
          placeholder="Paste the form content or description here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "16px",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box"
          }}
          onFocus={(e) => e.target.style.borderColor = "#6366f1"}
          onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        />
      )}

      {/* File Upload */}
      {mode === "file" && (
        <div style={{
          border: "2px dashed #c7d2fe",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          background: "#eef2ff"
        }}>
          <p style={{ fontSize: "32px", marginBottom: "8px" }}>📂</p>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>Upload PDF, Word (.docx), or TXT file</p>
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ color: "#6366f1" }}
          />
          {file && (
            <p style={{ color: "#6366f1", marginTop: "12px", fontWeight: "600" }}>
              ✅ {file.name}
            </p>
          )}
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          marginTop: "20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "16px",
          fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
          transition: "transform 0.2s"
        }}
        onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
        onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
      >
        🔍 Analyze Form
      </button>
    </div>
  )
}