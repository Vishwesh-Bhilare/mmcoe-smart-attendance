// app/api/attendance/mark/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyHMACToken } from "@/lib/hmac";
import { calculateDistanceMeters } from "@/lib/geo";
import { attendanceRateLimit } from "@/lib/rateLimit";
import { validateAttendanceInput } from "@/lib/validators";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();

  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rate = attendanceRateLimit(ip);

  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

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

  if (!profile || profile.role !== "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const validation = validateAttendanceInput(body);

  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.message },
      { status: 400 }
    );
  }

  const { qrToken, latitude, longitude } = body;

  const { data: activeSession } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("is_active", true)
    .single();

  if (!activeSession) {
    return NextResponse.json(
      { error: "No active session" },
      { status: 404 }
    );
  }

  const validToken = verifyHMACToken(
    qrToken,
    activeSession.secret_seed,
    activeSession.id
  );

  if (!validToken) {
    return NextResponse.json(
      { error: "Invalid QR token" },
      { status: 403 }
    );
  }

  const distance = calculateDistanceMeters(
    latitude,
    longitude,
    activeSession.classroom_lat,
    activeSession.classroom_lng
  );

  if (distance > activeSession.radius_meters) {
    return NextResponse.json(
      { error: "Outside classroom radius" },
      { status: 403 }
    );
  }

  const deviceHash = crypto
    .createHash("sha256")
    .update(session.user.id + ip)
    .digest("hex");

  const { error } = await supabase
    .from("attendance_records")
    .insert({
      session_id: activeSession.id,
      student_id: session.user.id,
      submission_lat: latitude,
      submission_lng: longitude,
      distance_meters: distance,
      ip_address: ip,
      device_hash: deviceHash,
    });

  if (error) {
    return NextResponse.json(
      { error: "Duplicate or insertion failed" },
      { status: 400 }
    );
  }

  await supabase.from("audit_logs").insert({
    actor_id: session.user.id,
    action: "ATTENDANCE_MARKED",
    metadata_json: {
      session_id: activeSession.id,
      distance,
      ip,
    },
  });

  return NextResponse.json({ success: true });
}

