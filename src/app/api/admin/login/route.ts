import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createSession } from "@/lib/auth";

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { username?: string; password?: string };
    const username = process.env.ADMIN_USERNAME || "";
    const password = process.env.ADMIN_PASSWORD || "";
    if (!username || !password || (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
      return NextResponse.json({ error: "Admin credentials are not configured on the server." }, { status: 503 });
    }
    if (!safeEqual(body.username || "", username) || !safeEqual(body.password || "", password)) {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
    }
    await createSession(username);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
