"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface DashboardLayoutProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  defaultLayout: number[];
  defaultCollapsed: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export function DashboardLayout({
  accounts,
  defaultLayout,
  defaultCollapsed,
  navCollapsedSize,
  children,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavItemClick = (itemId: string) => {
    router.push(`/dashboard/${itemId}`);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
      }}
      className="h-screen w-full "
    >
      <ResizablePanel
        defaultSize={10}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={5}
        maxSize={15}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
        }}
        className={`${isCollapsed ? "min-w-[50px]" : ""} bg-forest-700`}
      >
        <DashboardSidebar
          accounts={accounts}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onNavItemClick={handleNavItemClick}
          selectedItemId={pathname.split("/").pop()}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80} minSize={30}>
        <div className="h-screen w-full overflow-auto p-4">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
