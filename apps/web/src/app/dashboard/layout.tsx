// import React from "react";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <div className="">{children}</div>;
// }

import React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";

// You might want to fetch this data server-side
const accounts = [
  {
    label: "Alicia Koch",
    email: "alicia@example.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Vercel</title>
        <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
      </svg>
    ),
  },
  // ... other accounts
];

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-900 text-gray-300">
      <DashboardLayout
        accounts={accounts}
        defaultLayout={[265, 655]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      >
        {children}
      </DashboardLayout>
    </div>
  );
}
