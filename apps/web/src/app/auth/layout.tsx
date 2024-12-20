import React, { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </Suspense>
  );
}
