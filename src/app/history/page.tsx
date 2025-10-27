"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface Message {
  id: string;
  user_message: string;
  ai_reply: string;
  created_at: string;
}

export default function ChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error.message);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>جارِ تحميل سجل المحادثات...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📜 سجل المحادثات</h1>
      {messages.length === 0 ? (
        <p className="text-center text-gray-400">لا توجد محادثات بعد.</p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
            >
              <p className="text-blue-400 font-semibold">👤 المستخدم:</p>
              <p className="mb-2">{msg.user_message}</p>
              <p className="text-green-400 font-semibold">🤖 الذكاء الصناعي:</p>
              <p>{msg.ai_reply}</p>
              <p className="text-gray-500 text-sm mt-2">
                🕒 {new Date(msg.created_at).toLocaleString("ar-SA")}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
