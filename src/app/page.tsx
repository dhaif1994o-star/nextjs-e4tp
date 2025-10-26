"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // إرسال الرسالة إلى API
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      const aiMessage: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        role: "assistant",
        content: "حدث خطأ أثناء الاتصال بالخادم، حاول لاحقاً ⚠️",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // إرسال بالضغط على Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-6">
        جازان AI 💬
      </h1>

      <div className="flex-1 w-full max-w-2xl overflow-y-auto space-y-3 p-4 bg-gray-800 rounded-2xl shadow-lg">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg text-sm ${
              msg.role === "user"
                ? "bg-blue-600 text-right ml-auto w-fit"
                : "bg-gray-700 text-left mr-auto w-fit"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-2xl mt-6">
        <input
          type="text"
          className="flex-1 p-3 rounded-l-2xl text-gray-900 focus:outline-none"
          placeholder="اكتب رسالتك هنا..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-2xl font-semibold"
        >
          إرسال
        </button>
      </div>
    </main>
  );
}

