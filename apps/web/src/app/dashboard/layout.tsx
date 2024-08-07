import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
