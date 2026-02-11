// app/api/sessions/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const { courseId, lat, lng } = body;

  if (!courseId || !lat || !lng) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const secretSeed = crypto.randomBytes(32).toString("hex");

  const { data, error } = await supabase
    .from("class_sessions")
    .insert({
      course_id: courseId,
      faculty_id: session.user.id,
      classroom_lat: lat,
      classroom_lng: lng,
      radius_meters: 50,
      secret_seed: secretSeed,
      start_time: new Date().toISOString(),
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  return NextResponse.json({ sessionId: data.id });
}

