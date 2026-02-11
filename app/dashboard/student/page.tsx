// app/dashboard/student/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function StudentDashboard() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", session.user.id)
    .single();

  if (!profile || profile.role !== "student") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/student/scan"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">Scan QR</h2>
            <p className="text-sm text-gray-600">
              Scan rotating QR and mark attendance.
            </p>
          </Link>

          <Link
            href="/dashboard/student/history"
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">
              Attendance History
            </h2>
            <p className="text-sm text-gray-600">
              View your past attendance records.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

