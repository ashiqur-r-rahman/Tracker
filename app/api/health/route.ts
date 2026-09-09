import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ service: "meridian", status: "ok", configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) });
}
