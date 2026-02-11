// components/qr/QRDisplay.tsx

"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

interface QRDisplayProps {
  sessionId: string;
}

export default function QRDisplay({ sessionId }: QRDisplayProps) {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchToken = async () => {
    try {
      const res = await fetch(`/api/sessions/active?sessionId=${sessionId}`);
      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
      }
    } catch (error) {
      console.error("Failed to fetch QR token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
    const interval = setInterval(fetchToken, 30000);
    return () => clearInterval(interval);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <p className="text-sm text-gray-500">Generating QR...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
      {token ? (
        <>
          <QRCode value={token} size={250} />
          <p className="text-xs text-gray-500 mt-4">
            QR refreshes every 30 seconds
          </p>
        </>
      ) : (
        <p className="text-sm text-red-500">Session not active.</p>
      )}
    </div>
  );
}