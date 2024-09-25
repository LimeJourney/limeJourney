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
      <img src="/LimeJourney-logo.svg" alt="Logo" width={43} height={43} />
    </div>
  );
}
