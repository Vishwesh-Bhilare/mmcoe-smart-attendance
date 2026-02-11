import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AttendanceHistory() {
  const supabase = await createClient();

  // ✅ Use getUser() instead of getSession() (removes warning)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/student-login");
  }

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "student") {
    redirect("/student-login");
  }

  // Fetch attendance records
  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Attendance History</h1>

      {attendance && attendance.length > 0 ? (
        <div className="space-y-4">
          {attendance.map((record: any) => (
            <div
              key={record.id}
              className="border p-4 rounded-lg shadow-sm"
            >
              <p><strong>Course:</strong> {record.course_id}</p>
              <p><strong>Date:</strong> {new Date(record.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
}

