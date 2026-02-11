"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [activeTab, setActiveTab] = useState<"student" | "faculty">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      if (activeTab === "student") {
        // Student login only
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push("/dashboard/student");
      } else {
        // Faculty
        if (isSignup) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          alert("Faculty signup successful.");
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          router.push("/dashboard/faculty");
        }
      }
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => {
              setActiveTab("student");
              setIsSignup(false);
            }}
            className={`flex-1 py-2 font-medium ${
              activeTab === "student"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Student Login
          </button>

          <button
            onClick={() => setActiveTab("faculty")}
            className={`flex-1 py-2 font-medium ${
              activeTab === "faculty"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500"
            }`}
          >
            Faculty Login
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          {activeTab === "student"
            ? "Student Login"
            : isSignup
            ? "Faculty Sign Up"
            : "Faculty Login"}
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Button */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className={`w-full py-3 rounded text-white transition ${
            activeTab === "student"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-900 hover:bg-black"
          }`}
        >
          {loading
            ? "Please wait..."
            : activeTab === "student"
            ? "Login"
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>

        {/* Faculty Toggle */}
        {activeTab === "faculty" && (
          <p className="text-center mt-4 text-sm">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="ml-2 text-blue-600"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        )}

      </div>
    </div>
  );
}

