// app/api/attendance/mark/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
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

  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 400 }
    );
  }

  // Find active session
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("token", token)
    .eq("is_active", true)
    .single();

  if (!session) {
    return NextResponse.json(
      { error: "Session not active" },
      { status: 400 }
    );
  }

  // Insert attendance (unique constraint prevents duplicate)
  const { error } = await supabase
    .from("attendance")
    .insert({
      session_id: session.id,
      student_id: user.id,
    });

  if (error) {
    return NextResponse.json(
      { error: "Already marked attendance" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

