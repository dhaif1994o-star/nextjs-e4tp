import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const messages = await prisma.message.findMany();
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const { text } = await req.json();
  const message = await prisma.message.create({
    data: { text },
  });
  return NextResponse.json(message);
}
