import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "🔑 لا يوجد مفتاح OpenAI. أضِفه في .env.local" },
        { status: 500 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "أدخل رسالة صحيحة." }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "أنت مساعد ذكي اسمه جازان AI — ذكاء سعودي مستقل، ترد بالعربية بوضوح وسرعة وبأسلوب طبيعي.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI Error:", errText);
      return NextResponse.json(
        { error: "⚠️ فشل الاتصال بخدمة الذكاء الصناعي." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ?? "لم أتمكن من توليد رد الآن.";
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Server Error:", e);
    return NextResponse.json({ error: "حدث خطأ داخلي في السيرفر." }, { status: 500 });
  }
}
