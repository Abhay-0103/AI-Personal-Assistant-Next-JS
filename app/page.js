"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamResponse, setStreamResponse] = useState("");

  const handleChat = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Error: " + error.message);
    }

    setLoading(false);
  };

  const handleStreamChat = async () => {
    setStreaming(true);
    setStreamResponse("");

    try {
      const res = await fetch("/api/chat.stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setStreamResponse((prev) => prev + data.content);
          }
        }
      }
    } catch (error) {
      setStreamResponse("Error: " + error.message);
    }

    setStreaming(false);
  };

  return (
    <div
      className={styles.page}
      style={{
        minHeight: "100vh",
        padding: "30px 20px",
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        color: "#fff",
        fontFamily: "Segoe UI, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "38px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        🚀 Get Started With AI
      </h1>

      {/* Input Box */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="💬 Enter your message..."
        rows={4}
        style={{
          width: "100%",
          maxWidth: "600px",
          marginBottom: "15px",
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid #444",
          backgroundColor: "#0f3460",
          color: "#fff",
          fontSize: "16px",
          resize: "none",
          outline: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          transition: "border 0.2s ease",
        }}
        onFocus={(e) => (e.target.style.border = "1px solid #6a5acd")}
        onBlur={(e) => (e.target.style.border = "1px solid #444")}
      />

      {/* Buttons */}
      <div style={{ textAlign: "center", marginTop: "5px" }}>
        <button
          onClick={handleChat}
          disabled={loading}
          style={{
            padding: "12px 24px",
            backgroundColor: loading ? "#555" : "purple",
            margin: "6px",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            !loading && (e.target.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          {loading ? "⏳ Loading..." : "💡 Normal Chat"}
        </button>

        <button
          onClick={handleStreamChat}
          disabled={streaming}
          style={{
            padding: "12px 24px",
            backgroundColor: streaming ? "#555" : "red",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: streaming ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            !streaming && (e.target.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          {streaming ? "⏳ Streaming..." : "⚡ Stream Chat"}
        </button>
      </div>

      {/* Normal Chat Response */}
      {response && (
        <div
          style={{
            border: "1px solid #444",
            backgroundColor: "#0f3460",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "25px",
            whiteSpace: "pre-wrap",
            fontSize: "18px",
            maxWidth: "600px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          <strong style={{ color: "#ffcc70" }}>Normal Chat:</strong> {response}
        </div>
      )}

      {/* Streaming Response */}
      {streamResponse && (
        <div
          style={{
            border: "1px solid #444",
            backgroundColor: "#0f3460",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            fontSize: "18px",
            maxWidth: "600px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          <strong style={{ color: "#ff6f61" }}>Stream Chat:</strong>{" "}
          {streamResponse}
        </div>
      )}
    </div>
  );
}
