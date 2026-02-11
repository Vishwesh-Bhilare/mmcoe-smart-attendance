// app/dashboard/faculty/attendance/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FacultyAttendancePage() {
  const supabase = await createClient();

  // Get authenticated user (secure)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ensure faculty access
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "faculty") {
    redirect("/dashboard");
  }

  // Fetch all sessions for this faculty
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("faculty_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Attendance Sessions
        </h1>

        {sessions && sessions.length > 0 ? (
          <div className="space-y-6">
            {sessions.map((session: any) => (
              <div
                key={session.id}
                className="bg-white p-6 rounded-xl shadow"
              >
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(session.created_at).toLocaleString(
                    "en-IN",
                    {
                      hour12: true,
                    }
                  )}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {session.is_active ? (
                    <span className="text-green-600 font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Closed
                    </span>
                  )}
                </p>

                <p className="break-all">
                  <strong>Token:</strong>{" "}
                  {session.token}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow">
            <p>No sessions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

