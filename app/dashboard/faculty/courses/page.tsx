// app/dashboard/faculty/courses/page.tsx

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function CoursesPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("faculty_id", session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Courses</h1>

        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Course Code</th>
                <th className="p-3">Course Name</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course: any) => (
                <tr key={course.id} className="border-t">
                  <td className="p-3">{course.course_code}</td>
                  <td className="p-3">{course.course_name}</td>
                </tr>
              ))}

              {!courses?.length && (
                <tr>
                  <td colSpan={2} className="p-6 text-center text-gray-500">
                    No courses found.
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

