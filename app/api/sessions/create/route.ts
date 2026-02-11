// app/api/sessions/create/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function POST() {
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

  // 🔴 Step 1: Close previous active sessions
  await supabase
    .from("sessions")
    .update({ is_active: false })
    .eq("faculty_id", user.id)
    .eq("is_active", true);

  // 🟢 Step 2: Create new session with NEW token
  const newToken = randomUUID();

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      faculty_id: user.id,
      token: newToken,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(data);
}

