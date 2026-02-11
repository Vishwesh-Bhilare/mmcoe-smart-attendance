// components/layout/MobileNav.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface MobileNavProps {
  role: "student" | "faculty";
}

export default function MobileNav({ role }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard/student" },
    { name: "Scan QR", href: "/dashboard/student/scan" },
    { name: "History", href: "/dashboard/student/history" },
  ];

  const facultyLinks = [
    { name: "Dashboard", href: "/dashboard/faculty" },
    { name: "Courses", href: "/dashboard/faculty/courses" },
    { name: "Start Session", href: "/dashboard/faculty/session/start" },
    { name: "Attendance", href: "/dashboard/faculty/attendance" },
  ];

  const links = role === "student" ? studentLinks : facultyLinks;

  return (
    <>
      {/* Top Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <h1 className="font-semibold text-sm">MMCOE</h1>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-700 text-sm"
        >
          Menu
        </button>
      </div>

      {/* Drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40">
          <div className="bg-white w-64 h-full p-6 space-y-3">
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500 mb-4"
            >
              Close
            </button>

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "block px-4 py-2 rounded-lg text-sm font-medium transition",
                  pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}