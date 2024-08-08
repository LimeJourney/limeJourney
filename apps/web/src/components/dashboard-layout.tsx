// "use client";

// import React, { useState } from "react";
// import { DashboardSidebar } from "@/components/dashboard-sidebar";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import { InboxContent } from "@/components/inbox-content";

// interface DashboardLayoutProps {
//   accounts: {
//     label: string;
//     email: string;
//     icon: React.ReactNode;
//   }[];
//   defaultLayout: number[] | undefined;
//   defaultCollapsed: boolean | undefined;
//   navCollapsedSize: number;
// }

// export function DashboardLayout({
//   accounts,
//   defaultLayout = [265, 655],
//   defaultCollapsed = false,
//   navCollapsedSize,
// }: DashboardLayoutProps) {
//   const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
//   const [selectedItemId, setSelectedItemId] = useState("inbox");

//   const handleNavItemClick = (itemId: string) => {
//     setSelectedItemId(itemId);
//   };

//   const renderContent = () => {
//     switch (selectedItemId) {
//       case "inbox":
//         return <InboxContent />;
//       default:
//         return <div>Select an item from the sidebar</div>;
//     }
//   };

//   return (
//     <ResizablePanelGroup
//       direction="horizontal"
//       onLayout={(sizes: number[]) => {
//         document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
//       }}
//       className="h-full w-full"
//     >
//       <ResizablePanel
//         defaultSize={20}
//         collapsedSize={navCollapsedSize}
//         collapsible={true}
//         minSize={15}
//         maxSize={20}
//         onCollapse={() => {
//           setIsCollapsed(true);
//           document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
//         }}
//         onExpand={() => {
//           setIsCollapsed(false);
//           document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
//         }}
//         className={isCollapsed ? "min-w-[50px]" : ""}
//       >
//         <DashboardSidebar
//           accounts={accounts}
//           isCollapsed={isCollapsed}
//           setIsCollapsed={setIsCollapsed}
//           onNavItemClick={handleNavItemClick}
//         />
//       </ResizablePanel>
//       <ResizableHandle withHandle />
//       <ResizablePanel defaultSize={80} minSize={30}>
//         <div className="h-full w-full overflow-auto p-4">{renderContent()}</div>
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   );
// }

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
      className="h-screen w-full"
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
        className={isCollapsed ? "min-w-[50px]" : ""}
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
