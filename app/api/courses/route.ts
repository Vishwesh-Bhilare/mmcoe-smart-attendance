// app/api/courses/route.ts

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || profile.role !== "faculty") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, course_name, course_code")
    .eq("faculty_id", session.user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }

  return NextResponse.json(courses);
}

