// app/dashboard/faculty/attendance/page.tsx

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function FacultyAttendancePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data: sessions } = await supabase
    .from("class_sessions")
    .select(
      `
      id,
      start_time,
      courses (
        course_name,
        course_code
      ),
      attendance_records (
        id
      )
    `
    )
    .eq("faculty_id", session.user.id)
    .order("start_time", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Session Attendance</h1>

        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Course</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total Attendance</th>
              </tr>
            </thead>
            <tbody>
              {sessions?.map((sessionItem: any) => (
                <tr key={sessionItem.id} className="border-t">
                  <td className="p-3">
                    {sessionItem.courses?.course_name} (
                    {sessionItem.courses?.course_code})
                  </td>
                  <td className="p-3">
                    {new Date(
                      sessionItem.start_time
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {sessionItem.attendance_records?.length || 0}
                  </td>
                </tr>
              ))}

              {!sessions?.length && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    No session records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

