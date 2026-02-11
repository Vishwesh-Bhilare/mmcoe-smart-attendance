// components/shared/Loading.tsx

"use client";

export default function Loading({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}