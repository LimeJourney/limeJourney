"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface DashboardLogoProps {
  isCollapsed: boolean;
}

export function DashboardLogo({ isCollapsed }: DashboardLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-15 [&_svg]:w-15 [&_svg]:shrink-0 p-2",
        isCollapsed &&
          "flex h-15 w-15 shrink-0 items-center justify-center p-1 [&>span]:w-auto bg-white rounded-lg"
      )}
    >
      <svg
        width="43"
        height="43"
        viewBox="0 0 43 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="21.15" cy="21.15" r="21.15" fill="black" />
        <path
          d="M21.6785 15.0554H22.1211C25.2261 15.0554 26.7786 15.0554 27.3679 15.613C27.8774 16.0951 28.1031 16.8052 27.9656 17.4929C27.8065 18.2885 26.539 19.185 24.004 20.978L19.8625 23.9074C17.3275 25.7004 16.06 26.597 15.9009 27.3925C15.7634 28.0803 15.9891 28.7904 16.4986 29.2724C17.0879 29.8301 18.6404 29.8301 21.7454 29.8301H22.6975M18.1122 15.0554C18.1122 16.7436 16.7436 18.1122 15.0554 18.1122C13.3671 18.1122 11.9985 16.7436 11.9985 15.0554C11.9985 13.3671 13.3671 11.9985 15.0554 11.9985C16.7436 11.9985 18.1122 13.3671 18.1122 15.0554ZM32.3774 29.3206C32.3774 31.0088 31.0088 32.3774 29.3206 32.3774C27.6324 32.3774 26.2638 31.0088 26.2638 29.3206C26.2638 27.6324 27.6324 26.2638 29.3206 26.2638C31.0088 26.2638 32.3774 27.6324 32.3774 29.3206Z"
          stroke="#5aff91"
          stroke-width="0.650847"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}