"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter, useSearchParams } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScannerRunning = useRef(false);

  const [message, setMessage] = useState("Scanning...");
  const [hasScanned, setHasScanned] = useState(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (hasScanned) return;
            setHasScanned(true);

            try {
              if (isScannerRunning.current) {
                await scanner.stop();
                await scanner.clear();
                isScannerRunning.current = false;
              }
            } catch {}

            const token =
              tokenFromUrl ||
              new URL(decodedText).searchParams.get("token");

            if (!token) {
              setMessage("Invalid QR Code");
              return;
            }

            const res = await fetch("/api/attendance/mark", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (!res.ok) {
              setMessage(data.error || "Failed to mark attendance");
              return;
            }

            setMessage("✅ Attendance Marked");

            setTimeout(() => {
              router.replace("/dashboard/student");
            }, 1500);
          },
          () => {}
        );

        isScannerRunning.current = true;
      } catch {
        setMessage("Camera permission required.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && isScannerRunning.current) {
        scannerRef.current.stop().catch(() => {});
        isScannerRunning.current = false;
      }
    };
  }, [router, tokenFromUrl, hasScanned]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">Scan QR Code</h1>

      {/* IMPORTANT: Always keep this div mounted */}
      <div
        id="qr-reader"
        className={`w-full max-w-md mx-auto border rounded-lg ${
          hasScanned ? "opacity-0" : ""
        }`}
      />

      <p className="mt-6 text-lg">{message}</p>
    </div>
  );
}

