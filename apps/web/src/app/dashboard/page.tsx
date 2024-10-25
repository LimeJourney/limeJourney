import React from "react";
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
        <svg
          width="23"
          height="24"
          viewBox="0 0 23 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11.5763" cy="10.5763" r="10.5763" fill="black" />
          <path
            d="M11.8406 6.5286H12.0619C13.6146 6.5286 14.3909 6.5286 14.6856 6.80746C14.9404 7.04851 15.0533 7.40361 14.9845 7.74751C14.9049 8.14536 14.2711 8.59367 13.0035 9.49028L10.9324 10.9552C9.66481 11.8518 9.031 12.3001 8.95143 12.6979C8.88265 13.0418 8.99555 13.3969 9.25029 13.638C9.54499 13.9168 10.3213 13.9168 11.874 13.9168H12.3501M10.0572 6.5286C10.0572 7.37282 9.37282 8.0572 8.5286 8.0572C7.68438 8.0572 7 7.37282 7 6.5286C7 5.68438 7.68438 5 8.5286 5C9.37282 5 10.0572 5.68438 10.0572 6.5286ZM17.1907 13.6621C17.1907 14.5063 16.5063 15.1907 15.6621 15.1907C14.8179 15.1907 14.1335 14.5063 14.1335 13.6621C14.1335 12.8179 14.8179 12.1335 15.6621 12.1335C16.5063 12.1335 17.1907 12.8179 17.1907 13.6621Z"
            stroke="#FDFF79"
            strokeWidth="0.650847"
            stroke-linecap="round"
            strokeLinejoin="round"
          />
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
      <p>Select an item from the sidebar to get started.</p>
    </div>
  );
}
