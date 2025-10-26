import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // 🔍 بحث في قاعدة البيانات المحلية أولاً
    const localAnswer = await prisma.info.findFirst({
      where: {
        question: {
          contains: text,
          mode: "insensitive",
        },
      },
    });

    if (localAnswer) {
      return NextResponse.json({ reply: localAnswer.answer + " ✅ (من قاعدة البيانات المحلية)" });
    }

    // 🧠 إذا ما وجد جواب محلي، استخدم OpenAI
    const reply = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: text }],
      }),
    });

    const data = await reply.json();
    const answer =
      data.choices?.[0]?.message?.content ||
      "ما فهمت سؤالك، حاول تصيغه بطريقة ثانية 🤔";

    return NextResponse.json({ reply: answer });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { reply: "حدث خطأ أثناء معالجة طلبك 😕" },
      { status: 500 }
    );
  }
}
