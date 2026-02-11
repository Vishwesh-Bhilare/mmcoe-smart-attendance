"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (!scannerRef.current) return;

            if (isRunning) {
              await scannerRef.current.stop();
              setIsRunning(false);
            }

            console.log("QR detected:", decodedText);

            router.push(`/dashboard/student?qr=${decodedText}`);
          },
          () => {}
        );

        setIsRunning(true);
      } catch (err) {
        console.error("Scanner start error:", err);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && isRunning) {
        scannerRef.current
          .stop()
          .catch(() => {});
      }
    };
  }, [router, isRunning]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Scan QR Code</h1>
      <div
        id="qr-reader"
        className="w-full max-w-md mx-auto border rounded-lg"
      />
    </div>
  );
}

