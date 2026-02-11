// app/dashboard/faculty/session/stop/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StopSessionPage() {
  const router = useRouter();

  useEffect(() => {
    const stopSession = async () => {
      await fetch("/api/sessions/stop", { method: "POST" });
      router.push("/dashboard/faculty");
    };

    stopSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Stopping session...</p>
    </div>
  );
}

