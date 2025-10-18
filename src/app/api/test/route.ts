import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'API working correctly ✅',
    project: 'Jazan AI Web'
  });
}
