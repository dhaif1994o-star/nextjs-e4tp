"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply = data.reply || "تعذر الحصول على رد.";

      // تأثير التوليد الحرفي
      let text = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      for (const ch of reply) {
        text += ch;
        await new Promise((r) => setTimeout(r, 20));
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = text;
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "حدث خطأ أثناء الاتصال بالخدمة." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-white text-black p-6">
      {/* العنوان */}
      <div className="flex flex-col items-center justify-center mt-6 mb-4">
        <img src="/falcon-logo.png" alt="Jazan AI Logo" className="w-24 h-24 object-contain mb-3" />
        <h1 className="text-3xl font-bold">جازان <span className="text-gray-800">AI</span></h1>
        <p className="text-gray-600 text-sm mt-1">
          تم تطوير هذا المشروع في جازان عام 2025 — ذكاء سعودي مستقل 🇸🇦
        </p>
      </div>

      {/* المحادثة */}
      <div
        ref={scrollRef}
        className="w-full max-w-3xl bg-gray-100 p-5 rounded-3xl shadow-inner min-h-[420px] max-h-[60vh] overflow-y-auto"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            dir="rtl"
            className={`my-2 px-4 py-3 rounded-2xl max-w-[85%] leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto text-right"
                : "bg-gray-300 text-black self-start mr-auto text-right"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-400 text-sm mt-2 animate-pulse">جارٍ التفكير...</p>}
      </div>

      {/* الإدخال */}
      <div className="flex items-center w-full max-w-2xl mt-6">
        <input
          dir="rtl"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-right"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="ml-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 disabled:opacity-50"
        >
          <ArrowUpRight size={22} />
        </button>
      </div>

      <footer className="text-center text-sm text-gray-500 mt-6">
        © 2025 — تطوير شخصي من جازان 🇸🇦
      </footer>
    </main>
  );
}
