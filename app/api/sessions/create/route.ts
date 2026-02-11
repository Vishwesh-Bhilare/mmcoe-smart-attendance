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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Deactivate previous sessions
  await supabase
    .from("sessions")
    .update({ is_active: false })
    .eq("faculty_id", user.id);

  const token = randomUUID();

  const { data, error } = await supabase
    .from("sessions")
    .insert([
      {
        faculty_id: user.id,
        token,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(
    new URL("/dashboard/faculty/session/start", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
  );
}

