"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRDisplay({ token }: { token: string }) {
  const [attendanceUrl, setAttendanceUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/dashboard/student/scan?token=${token}`;
      setAttendanceUrl(url);
    }
  }, [token]);

  if (!attendanceUrl) return null;

  return (
    <div className="flex flex-col items-center space-y-6">
      <QRCodeCanvas
        value={attendanceUrl}
        size={300}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
      />

      <p className="text-sm text-gray-600">
        Students scan this QR to mark attendance.
      </p>
    </div>
  );
}

