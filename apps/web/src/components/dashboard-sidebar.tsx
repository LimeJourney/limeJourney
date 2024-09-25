"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Inbox,
  File,
  Send,
  ArchiveX,
  Trash2,
  Archive,
  Users2,
  AlertCircle,
  MessagesSquare,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  CreditCard,
  KeyIcon,
  UsersIcon,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { AccountSwitcher } from "./account-switcher";
import {
  FaceIcon,
  GearIcon,
  MagicWandIcon,
  PersonIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { DashboardLogo } from "./dashboard-logo";

interface NavItem {
  id: string;
  title: string;
  icon: React.ElementType;
  href: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    id: "audience",
    title: "Audience",
    icon: FaceIcon,
    href: "/dashboard/audience",
    children: [
      {
        id: "entities",
        title: "Entities",
        icon: PersonIcon,
        href: "/dashboard/audience/entities",
      },
      {
        id: "segments",
        title: "Segments",
        icon: AlertCircle,
        href: "/dashboard/audience/segments",
      },
      {
        id: "insights",
        title: "AI Insights",
        icon: MagicWandIcon,
        href: "/dashboard/audience/insights",
      },
    ],
  },
  {
    id: "events",
    title: "Events",
    icon: StarIcon,
    href: "/dashboard/events",
  },
  {
    id: "journeys",
    title: "Journeys",
    icon: File,
    href: "/dashboard/journeys",
  },
  {
    id: "channels",
    title: "Channels",
    icon: Inbox,
    href: "/dashboard/channels",
  },
  {
    id: "templates",
    title: "Templates",
    icon: File,
    href: "/dashboard/templates",
  },
  {
    id: "settings",
    title: "Settings",
    icon: GearIcon,
    href: "/dashboard/settings",
    children: [
      {
        id: "billing",
        title: "Billing",
        icon: CreditCard,
        href: "/dashboard/settings/billing",
      },
      {
        id: "api-keys",
        title: "API Keys",
        icon: KeyIcon,
        href: "/dashboard/settings/api-keys",
      },
      {
        id: "team",
        title: "Team",
        icon: UsersIcon,
        href: "/dashboard/settings/team",
      },
    ],
  },
];

const getInitialOpenItems = (items: NavItem[]): string[] => {
  return items.reduce((acc: string[], item) => {
    if (item.children) {
      return [...acc, item.id, ...item.children.map((child) => child.id)];
    }
    return acc;
  }, []);
};

interface Account {
  label: string;
  email: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  accounts: Account[];
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onNavItemClick: (itemId: string) => void;
  selectedItemId: string | undefined;
}

export function DashboardSidebar({
  accounts,
  isCollapsed,
  setIsCollapsed,
  onNavItemClick,
  selectedItemId,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = React.useState<string[]>(
    getInitialOpenItems(navItems)
  );

  const toggleItem = (itemId: string) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(itemId)
        ? prevOpenItems.filter((item) => item !== itemId)
        : [...prevOpenItems, itemId]
    );
  };

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href} passHref>
                <Button
                  variant={item.id === selectedItemId ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    level > 0 && "pl-8",
                    isCollapsed && "px-2",
                    item.id === selectedItemId
                      ? "bg-meadow-700 text-black"
                      : "hover:bg-meadow-300 hover:text-black",
                    "transition-colors duration-200"
                  )}
                  onClick={(e) => {
                    if (item.children) {
                      e.preventDefault();
                      toggleItem(item.id);
                    } else {
                      onNavItemClick(item.id);
                    }
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {!isCollapsed && (
                    <>
                      <span>{item.title}</span>
                      {item.children && (
                        <div className="ml-auto flex items-center justify-center">
                          <div
                            className={cn(
                              "rounded-full p-1 transition-all duration-200 ease-in-out",
                              "bg-meadow-700",
                              "shadow-sm hover:shadow-md",
                              "transform hover:scale-105",
                              openItems.includes(item.id) ? "rotate-180" : ""
                            )}
                          >
                            <ChevronDown className="h-3 w-3 text-black" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">{item.title}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        {item.children && openItems.includes(item.id) && !isCollapsed && (
          <div className="mt-1">{renderNavItems(item.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={cn(
          "flex h-[52px] items-center justify-center",
          isCollapsed ? "h-[52px]" : "px-2"
        )}
      >
        <DashboardLogo isCollapsed={isCollapsed} />
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          <nav className="grid gap-1">{renderNavItems(navItems)}</nav>
        </div>
      </ScrollArea>
    </div>
  );
}
