// components/shared/RoleGuard.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface RoleGuardProps {
  allowedRole: "student" | "faculty" | "admin";
  children: React.ReactNode;
}

export default function RoleGuard({
  allowedRole,
  children,
}: RoleGuardProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        router.replace("/login");
        return;
      }

      if (profile.role !== allowedRole) {
        router.replace("/dashboard");
        return;
      }

      setAuthorized(true);
    };

    checkRole();
  }, [allowedRole, router, supabase]);

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Checking access...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
