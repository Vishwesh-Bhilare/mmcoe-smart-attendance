// components/qr/QRScanner.tsx

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});

interface QRScannerProps {
  onScanSuccess: (token: string) => void;
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  const handleResult = (result: any) => {
    if (result && !scanned) {
      setScanned(true);
      onScanSuccess(result?.text);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-xl shadow">
      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={(result: any, err: any) => {
          if (result) {
            handleResult(result);
          }
          if (err) {
            setError("Camera access required.");
          }
        }}
        containerStyle={{ width: "100%" }}
      />

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}