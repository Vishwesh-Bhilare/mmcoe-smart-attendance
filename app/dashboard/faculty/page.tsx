// app/dashboard/faculty/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function FacultyDashboard() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || profile.role !== "faculty") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Faculty Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/faculty/courses"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">Manage Courses</h2>
            <p className="text-sm text-gray-600">
              Create and manage your subjects.
            </p>
          </Link>

          <Link
            href="/dashboard/faculty/session/start"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">Start Attendance</h2>
            <p className="text-sm text-gray-600">
              Start a new live QR attendance session.
            </p>
          </Link>

          <Link
            href="/dashboard/faculty/attendance"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">View Attendance</h2>
            <p className="text-sm text-gray-600">
              View session attendance and export CSV.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

