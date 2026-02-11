// app/dashboard/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
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

  if (!profile) {
    redirect("/login");
  }

  if (profile.role === "student") {
    redirect("/dashboard/student");
  }

  if (profile.role === "faculty") {
    redirect("/dashboard/faculty");
  }

  redirect("/login");
}

