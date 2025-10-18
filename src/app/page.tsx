"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Connecting to API...");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    fetch(`${apiUrl}/`)
      .then((res) => res.json())
      .then((data) => setMessage(`✅ Connected to API: ${data.message}`))
      .catch((err) => setMessage(`❌ Connection failed: ${err.message}`));
  }, []);

  return (
    <main style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <h1 style={{ fontSize: "2rem" }}>Jazan AI Web</h1>
      <p>{message}</p>
    </main>
  );
}

