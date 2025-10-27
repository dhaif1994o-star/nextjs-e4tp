"use client";

import { useState } from "react";

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

<h2 className="text-lg text-green-600">تم الربط بنجاح 🎯</h2>      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      const aiMessage: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        role: "assistant",
        content: "حدث خطأ أثناء محاولة الحصول على استجابة.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2">جازان AI 🤖</h1>
      <p className="text-gray-400 mb-6 text-center max-w-xl">
        تم تطوير هذا النظام بجهد فردي في <span className="text-blue-400">جازان</span>،
        ليكون مثالًا على الإصرار والتعلم الذاتي في عالم الذكاء الاصطناعي.
      </p>

      <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-xl shadow-lg flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-right ml-auto max-w-[80%]"
                  : "bg-gray-700 text-left mr-auto max-w-[80%]"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 p-2 rounded-lg text-black outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
          >
            إرسال
          </button>
        </div>

        <div className="text-center mt-6">
          <a
            href="/history"
            className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold transition"
          >
            📜 عرض سجل المحادثات
          </a>
        </div>
      </div>

      <footer className="mt-8 text-gray-500 text-sm text-center">
        © 2025 تم تطوير هذا المشروع بجهد شخصي وكفاح مستمر — 
        <span className="text-blue-400"> رحلة تعلم لا تنتهي ❤️</span>
      </footer>
    </main>
  );
}
