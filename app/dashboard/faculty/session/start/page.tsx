// app/dashboard/faculty/session/start/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QRDisplay from "@/components/qr/QRDisplay";
import { randomUUID } from "crypto";

export default async function StartSessionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Ensure faculty
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "faculty") {
    redirect("/dashboard");
  }

  // 🔴 Always close previous sessions
  await supabase
    .from("sessions")
    .update({ is_active: false })
    .eq("faculty_id", user.id)
    .eq("is_active", true);

  // 🟢 Always create new session
  const newToken = randomUUID();

  const { data: newSession } = await supabase
    .from("sessions")
    .insert({
      faculty_id: user.id,
      token: newToken,
      is_active: true,
    })
    .select()
    .single();

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-6">
        New Attendance Session Started
      </h1>

      <QRDisplay token={newSession.token} />
    </div>
  );
}

