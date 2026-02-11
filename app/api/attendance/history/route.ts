// app/api/attendance/history/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get faculty session
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("faculty_id", user.id)
    .eq("is_active", true)
    .single();

  if (!session) {
    return NextResponse.json({ attendance: [] });
  }

  const { data: attendance } = await supabase
    .from("attendance")
    .select("student_id, scanned_at")
    .eq("session_id", session.id)
    .order("scanned_at", { ascending: false });

  return NextResponse.json({ attendance });
}

