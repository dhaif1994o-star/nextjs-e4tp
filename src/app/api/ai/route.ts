import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const replyRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "أنت مساعد ذكي لمنصة جازان AI." },
          { role: "user", content: text },
        ],
      }),
    });

    if (!replyRes.ok) {
      const err = await replyRes.text();
      console.error("OpenAI error:", err);
      return NextResponse.json(
        { error: "OpenAI request failed", details: err },
        { status: 500 }
      );
    }

    const data = await replyRes.json();
    const answer: string =
      data?.choices?.[0]?.message?.content ?? "عذرًا، لم أتمكن من توليد رد.";

    const { error } = await supabase
      .from("messages")
      .insert({ user_message: text, ai_reply: answer });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reply: answer });
  } catch (e: any) {
    console.error("Server error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
