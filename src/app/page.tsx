"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      const reply = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "حدث خطأ أثناء الاتصال 😕" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-4">جازان AI 💬</h1>

      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full space-y-3 p-4 bg-gray-800 rounded-lg">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[75%] ${
              msg.role === "user"
                ? "bg-blue-600 ml-auto text-right"
                : "bg-gray-700 mr-auto text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-center text-gray-400">🤖 جاري التفكير...</p>}
      </div>

      <div className="max-w-2xl mx-auto w-full mt-4 flex">
        <input
          type="text"
          className="flex-1 p-3 rounded-l-lg bg-gray-800 text-white"
          placeholder="اكتب رسالتك..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg"
        >
          إرسال
        </button>
      </div>
    </main>
  );
}

