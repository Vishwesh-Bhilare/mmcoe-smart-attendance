// app/dashboard/faculty/session/live/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LiveSessionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("faculty_id", user.id)
    .eq("is_active", true)
    .single();

  if (!session) {
    return <div className="p-8">No active session.</div>;
  }

  const { data: attendance } = await supabase
    .from("attendance")
    .select("student_id, scanned_at")
    .eq("session_id", session.id)
    .order("scanned_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Live Attendance
      </h1>

      <p className="mb-4 text-sm text-gray-600">
        Session Token: {session.token}
      </p>

      {attendance && attendance.length > 0 ? (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Student ID</th>
              <th className="p-3 border">Scanned At</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record: any) => (
              <tr key={record.student_id}>
                <td className="p-3 border">
                  {record.student_id}
                </td>
                <td className="p-3 border">
                  {new Date(
                    record.scanned_at
                  ).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students scanned yet.</p>
      )}
    </div>
  );
}

