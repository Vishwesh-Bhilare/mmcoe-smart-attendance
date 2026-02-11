// app/dashboard/faculty/session/active/page.tsx

"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";

export default function ActiveSessionPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch("/api/sessions/active");
      const data = await res.json();
      setToken(data.token);
    };

    fetchToken();
    const interval = setInterval(fetchToken, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-6">Active Attendance Session</h1>

      {token && (
        <div className="bg-white p-6 rounded-xl shadow">
          <QRCode value={token} size={250} />
        </div>
      )}

      <button
        onClick={() => router.push("/dashboard/faculty/session/stop")}
        className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg"
      >
        Stop Session
      </button>
    </div>
  );
}

