///Users/tobi/Documents/Code/lime/apps/web/src/app/dashboard/page.tsx
import React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from "next/headers";

export default function DashboardPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

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
    {
      label: "Alicia Koch2",
      email: "alicia@example.com",
      icon: (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Vercel</title>
          <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "Alicia Koch3",
      email: "alicia@example.com",
      icon: (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Vercel</title>
          <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
        </svg>
      ),
    },
  ];
  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>This is the audience Page</p>
    </div>
  );
}
