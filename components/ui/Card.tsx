// components/ui/Card.tsx

import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white shadow-md rounded-xl p-6 border border-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}