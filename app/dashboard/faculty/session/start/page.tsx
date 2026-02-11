// app/dashboard/faculty/session/start/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StartSessionPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const handleStart = async () => {
    if (!courseId) return;

    setLoading(true);

    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
    );

    const res = await fetch("/api/sessions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard/faculty/session/active");
    } else {
      alert("Failed to start session.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-6">Start Attendance Session</h1>

        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.course_name}
            </option>
          ))}
        </select>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Starting..." : "Start Session"}
        </button>
      </div>
    </div>
  );
}

