// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          MMCOE Smart Attendance Portal
        </h1>

        <p className="text-lg text-gray-600 mb-10">
          Secure, geo-fenced, rotating QR-based attendance system.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Login
          </Link>
        </div>

        <div className="mt-16 text-sm text-gray-500">
          © {new Date().getFullYear()} MMCOE. All rights reserved.
        </div>
      </div>
    </main>
  );
}

