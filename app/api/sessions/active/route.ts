// app/api/sessions/active/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateHMACToken } from "@/lib/hmac";

export async function GET(req: NextRequest) {
  const supabase = createServerSupabaseClient();

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let query = supabase
    .from("class_sessions")
    .select("*")
    .eq("faculty_id", session.user.id)
    .eq("is_active", true);

  if (sessionId) {
    query = query.eq("id", sessionId);
  }

  const { data: activeSession, error } = await query.single();

  if (error || !activeSession) {
    return NextResponse.json({ error: "No active session" }, { status: 404 });
  }

  const token = generateHMACToken(
    activeSession.secret_seed,
    activeSession.id
  );

  return NextResponse.json({ token, sessionId: activeSession.id });
}

