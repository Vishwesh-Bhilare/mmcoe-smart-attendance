// app/dashboard/student/history/page.tsx

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function AttendanceHistory() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data: records } = await supabase
    .from("attendance_records")
    .select(
      `
      id,
      server_timestamp,
      class_sessions (
        start_time,
        courses (
          course_name,
          course_code
        )
      )
    `
    )
    .eq("student_id", session.user.id)
    .order("server_timestamp", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Attendance History
        </h1>

        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Course</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((record: any) => (
                <tr
                  key={record.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    {record.class_sessions?.courses?.course_name} (
                    {record.class_sessions?.courses?.course_code})
                  </td>
                  <td className="p-3">
                    {new Date(
                      record.server_timestamp
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {new Date(
                      record.server_timestamp
                    ).toLocaleTimeString()}
                  </td>
                </tr>
              ))}

              {!records?.length && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-6 text-center text-gray-500"
                  >
                    No attendance records found.
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

