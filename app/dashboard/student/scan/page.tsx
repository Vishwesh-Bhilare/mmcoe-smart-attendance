// app/dashboard/student/scan/page.tsx

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const QrReader = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});

export default function ScanPage() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (data: any) => {
    if (!data || scanned) return;

    setScanned(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrToken: data?.text,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Attendance failed.");
        setScanned(false);
        return;
      }

      alert("Attendance marked successfully!");
      router.push("/dashboard/student");
    } catch (err) {
      setError("Location permission required.");
      setScanned(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-6">Scan Attendance QR</h1>

      <div className="w-full max-w-md bg-white p-4 rounded-xl shadow">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result: any) => {
            if (result) {
              handleScan(result);
            }
          }}
          containerStyle={{ width: "100%" }}
        />
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

