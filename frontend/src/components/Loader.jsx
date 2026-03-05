export default function Loader() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px",
      gap: "16px"
    }}>
      <div style={{
        width: "52px",
        height: "52px",
        border: "4px solid rgba(255,255,255,0.3)",
        borderTop: "4px solid white",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <p style={{ color: "white", fontWeight: "600", fontSize: "18px" }}>Analyzing your form...</p>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>This may take a few seconds</p>
    </div>
  )
}