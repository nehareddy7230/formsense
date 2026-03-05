import { useState, useEffect } from "react"
import axios from "axios"
import { supabase } from "./supabaseClient"
import URLInput from "./components/URLInput"
import ResultCard from "./components/ResultCard"
import Loader from "./components/Loader"
import Auth from "./components/Auth"

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [history, setHistory] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setCheckingAuth(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) fetchHistory()
  }, [user])

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("analyses")
      .select("id, title, input_type, created_at, summary")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30)
    if (!error) setHistory(data || [])
  }

  const analyze = async ({ url, text, file }) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      if (url) formData.append("url", url)
      if (text) formData.append("text", text)
      if (file) formData.append("file", file)
      if (user) formData.append("user_id", user.id)

      const response = await axios.post("https://formsense.onrender.com/analyze", formData)
      setResult(response.data)
      fetchHistory()
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadFromHistory = async (item) => {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", item.id)
      .single()

    if (!error && data) {
      setResult({
        title: data.title,
        summary: data.summary,
        deadline: data.deadline,
        eligibility: typeof data.eligibility === "string" ? JSON.parse(data.eligibility) : data.eligibility,
        documents_required: typeof data.documents_required === "string" ? JSON.parse(data.documents_required) : data.documents_required,
        steps: typeof data.steps === "string" ? JSON.parse(data.steps) : data.steps,
        warnings: typeof data.warnings === "string" ? JSON.parse(data.warnings) : data.warnings,
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setResult(null)
    setHistory([])
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  }

  const getIcon = (type) => {
    if (type === "url") return "🔗"
    if (type === "document") return "📄"
    return "📝"
  }

  if (checkingAuth) return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ color: "white", fontSize: "18px" }}>Loading...</div>
    </div>
  )

  if (!user) return <Auth />

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      overflow: "hidden"
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? "260px" : "0px",
        minWidth: sidebarOpen ? "260px" : "0px",
        background: "#1e1b4b",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        overflow: "hidden"
      }}>

        {/* Sidebar Header */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>📋</span>
            <span style={{ color: "white", fontWeight: "800", fontSize: "18px" }}>FormSense</span>
          </div>
          <button
            onClick={() => { setResult(null); setError(null) }}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              padding: "10px",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            + New Analysis
          </button>
        </div>

        {/* History List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "11px",
            fontWeight: "600",
            padding: "0 8px",
            marginBottom: "8px",
            textTransform: "uppercase"
          }}>
            Recent
          </p>
          {history.length === 0 && (
            <p style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "13px",
              padding: "8px",
              textAlign: "center"
            }}>
              No analyses yet
            </p>
          )}
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => loadFromHistory(item)}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "4px",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px" }}>{getIcon(item.input_type)}</span>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: 0
                  }}>
                    {item.title || "Untitled Form"}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: 0 }}>
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User info */}
        <div style={{
          padding: "16px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <p style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "12px",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "160px"
          }}>
            {user.email}
          </p>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflowY: "auto",
        padding: "30px 20px"
      }}>

        {/* Toggle sidebar button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            top: "16px",
            left: sidebarOpen ? "270px" : "16px",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            transition: "left 0.3s ease",
            zIndex: 100
          }}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>

        <div style={{ maxWidth: "760px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px", paddingTop: "20px" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "50px",
              padding: "8px 20px",
              marginBottom: "16px"
            }}>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>✨ AI-Powered Form Analyzer</span>
            </div>
            <h1 style={{
              fontSize: "48px",
              fontWeight: "800",
              color: "white",
              marginBottom: "12px",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)"
            }}>📋 FormSense</h1>
            <p style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "18px",
              maxWidth: "500px",
              margin: "0 auto"
            }}>
              Paste a URL, upload a document, or paste text — instantly understand any form
            </p>
          </div>

          <URLInput onAnalyze={analyze} />

          {loading && <Loader />}
          {error && (
            <div style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "12px",
              padding: "16px",
              color: "#dc2626",
              textAlign: "center",
              marginTop: "20px"
            }}>
              ❌ {error}
            </div>
          )}
          {result && <ResultCard result={result} />}

        </div>
      </div>
    </div>
  )
}