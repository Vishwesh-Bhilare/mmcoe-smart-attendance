// app/api/attendance/history/route.ts

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: records } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", session.user.id)
    .order("server_timestamp", { ascending: false });

  return NextResponse.json(records || []);
}

