import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function StudentDashboard() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || profile.role !== "student") {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="space-y-4">
        <Link
          href="/dashboard/student/scan"
          className="block bg-blue-600 text-white px-6 py-3 rounded"
        >
          Scan QR
        </Link>

        <Link
          href="/dashboard/student/history"
          className="block bg-gray-800 text-white px-6 py-3 rounded"
        >
          View Attendance History
        </Link>
      </div>
    </div>
  );
}

