// app/api/sessions/validate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyHMACToken } from "@/lib/hmac";

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();

  const body = await req.json();
  const { sessionId, qrToken } = body;

  if (!sessionId || !qrToken) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { data: sessionData } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("is_active", true)
    .single();

  if (!sessionData) {
    return NextResponse.json({ error: "Session not active" }, { status: 404 });
  }

  const valid = verifyHMACToken(
    qrToken,
    sessionData.secret_seed,
    sessionData.id
  );

  if (!valid) {
    return NextResponse.json({ error: "Invalid QR token" }, { status: 403 });
  }

  return NextResponse.json({ valid: true });
}

