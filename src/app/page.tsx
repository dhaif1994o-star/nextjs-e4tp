"use client";

import { useState } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

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
        content: "حدث خطأ أثناء محاولة الحصول على الرد. الرجاء المحاولة لاحقًا.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white p-4">
      <h1 className="text-3xl font-bold mb-4">جازان AI 💬</h1>
      <p className="text-gray-300 mb-6 text-center">
        تم تطوير هذا المشروع الفردي من جازان عام 2025 — خطوة أولى في بناء ذكاء اصطناعي عربي مستقل.
      </p>

      <div className="w-full max-w-xl bg-gray-800 p-4 rounded-2xl shadow-lg">
        <div className="h-96 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl ${
                msg.role === "user" ? "bg-blue-600 text-right" : "bg-gray-700 text-left"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-grow p-2 rounded-xl text-black"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            إرسال
          </button>
        </div>

        <div className="flex justify-between mt-4 text-sm text-gray-400">
          <Link href="/history" className="hover:text-blue-400">
            📜 عرض سجل المحادثات
          </Link>
          <span>© 2025 — تطوير شخصي من جازان</span>
        </div>
      </div>
    </main>
  );
}
