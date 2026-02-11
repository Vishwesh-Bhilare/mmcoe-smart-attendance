// app/dashboard/faculty/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FacultyDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/teacher-login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "faculty") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-2xl font-bold">
          Faculty Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Manage Courses */}
          <Link
            href="/dashboard/faculty/courses"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">
              Manage Courses
            </h2>
            <p className="text-sm text-gray-600">
              Create and manage your subjects.
            </p>
          </Link>

          {/* Start Attendance Session */}
          <Link
            href="/dashboard/faculty/session/start"
            className="bg-green-600 text-white shadow rounded-xl p-6 hover:bg-green-700 transition"
          >
            <h2 className="text-lg font-semibold mb-2">
              Start Attendance
            </h2>
            <p className="text-sm">
              Start a new live QR attendance session.
            </p>
          </Link>

          {/* View Attendance */}
          <Link
            href="/dashboard/faculty/attendance"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">
              View Attendance
            </h2>
            <p className="text-sm text-gray-600">
              View session attendance and export CSV.
            </p>
          </Link>

        </div>

      </div>
    </div>
  );
}

