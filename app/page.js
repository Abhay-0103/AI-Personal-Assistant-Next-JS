"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState("");
  const [streamResponse, setStreamResponse] = useState("");

  const handleChat = async () => {
    setLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      })

      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      setResponse("Error: " + error.message)
    }

    setLoading(false)
  }
  return (
    <div className={styles.page}>
      <h1> Get Started With AI </h1>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </div>
      <div>
        <button 
        onClick={handleChat}
        style={{ padding: "10px 20px", backgroundColor:"purple"}}>
          {loading ? "Loading...": "Chat"}
          </button>
      </div>
      <div
      style={{
        border: "1px solid whilte",
        padding: "10px",
        whiteSpace: "pre-wrap",
        fontSize: "28px",
      }}
      > 
       {response}
      </div>
    </div>
  );
}
