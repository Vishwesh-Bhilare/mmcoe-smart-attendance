// app/dashboard/faculty/session/start/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QRDisplay from "@/components/qr/QRDisplay";

export default async function StartSessionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/teacher-login");
  }

  // Verify faculty role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "faculty") {
    redirect("/dashboard");
  }

  // Check if active session exists
  const { data: existing } = await supabase
    .from("sessions")
    .select("*")
    .eq("faculty_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (existing) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold mb-6">
          Active Session Running
        </h1>
        <QRDisplay token={existing.token} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-6">
        Start New Attendance Session
      </h1>

      <form action="/api/sessions/create" method="POST">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Create Session & Generate QR
        </button>
      </form>
    </div>
  );
}

