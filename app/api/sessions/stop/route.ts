// app/api/sessions/stop/route.ts

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: activeSession } = await supabase
    .from("class_sessions")
    .select("id")
    .eq("faculty_id", session.user.id)
    .eq("is_active", true)
    .single();

  if (!activeSession) {
    return NextResponse.json({ error: "No active session found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("class_sessions")
    .update({
      is_active: false,
      end_time: new Date().toISOString(),
    })
    .eq("id", activeSession.id);

  if (error) {
    return NextResponse.json({ error: "Failed to stop session" }, { status: 500 });
  }

  return NextResponse.json({ message: "Session stopped successfully" });
}

