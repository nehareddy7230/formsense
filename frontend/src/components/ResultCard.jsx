export default function ResultCard({ result }) {
  console.log("Result received:", result)

  if (!result) return null

  if (result.error) return (
    <div style={{
      background: "#fee2e2",
      border: "1px solid #fca5a5",
      borderRadius: "16px",
      padding: "24px",
      color: "#dc2626"
    }}>
      ❌ {result.error}
    </div>
  )

  // Parse fields if they come as strings
  const eligibility = typeof result.eligibility === "string" ? JSON.parse(result.eligibility) : result.eligibility
  const documents = typeof result.documents_required === "string" ? JSON.parse(result.documents_required) : result.documents_required
  const steps = typeof result.steps === "string" ? JSON.parse(result.steps) : result.steps
  const warnings = typeof result.warnings === "string" ? JSON.parse(result.warnings) : result.warnings

  return (
    <div style={{
      background: "white",
      borderRadius: "20px",
      padding: "32px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    }}>

      {/* Title */}
      <div>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1e1b4b", marginBottom: "8px" }}>
          {result.title || "Form Analysis"}
        </h2>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>{result.summary}</p>
      </div>

      {/* Deadline */}
      {result.deadline && (
        <div style={{
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: "12px",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "20px" }}>⏰</span>
          <span style={{ color: "#c2410c", fontWeight: "600" }}>Deadline: {result.deadline}</span>
        </div>
      )}

      <Section title="✅ Eligibility" items={eligibility} color="#dcfce7" border="#86efac" text="#166534" />
      <Section title="📄 Documents Required" items={documents} color="#dbeafe" border="#93c5fd" text="#1e40af" />
      <Section title="🪜 How to Apply" items={steps} color="#ede9fe" border="#c4b5fd" text="#5b21b6" numbered />
      {warnings?.length > 0 && (
        <Section title="⚠️ Warnings" items={warnings} color="#fef9c3" border="#fde047" text="#854d0e" />
      )}

    </div>
  )
}

function Section({ title, items, color, border, text, numbered }) {
  if (!items || items.length === 0) return null

  return (
    <div>
      <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#374151", marginBottom: "12px" }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: color,
            border: `1px solid ${border}`,
            borderRadius: "10px",
            padding: "12px 16px",
            color: text,
            fontSize: "15px"
          }}>
            {numbered ? `${i + 1}. ${item}` : `• ${item}`}
          </div>
        ))}
      </div>
    </div>
  )
}