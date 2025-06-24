import React from 'react'

const demo = ({ messages }) => {
  return (
 <div style={{ maxHeight: "400px", overflowY: "auto", padding: "1rem" }}>
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: msg.source === "ai" ? "flex-end" : "flex-start",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              backgroundColor: msg.source === "ai" ? "#DCF8C6" : "#FFF",
              color: "#000",
              padding: "8px 12px",
              borderRadius: "12px",
              maxWidth: "60%",
              boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            }}
          >
            {msg.message}
          </div>
        </div>
      ))}
    </div>
  )
}

export default demo
