"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Receipt,
  CreditCard,
  DollarSign,
  Plug,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Tag,
  PuzzleIcon,
  FileText,
  Activity,
  Wallet,
  Calculator,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/lib/stores/ui";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/stores/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Plans", href: "/plans", icon: Package },
  { name: "Billable Metrics", href: "/billable-metrics", icon: Activity },
  { name: "Add-ons", href: "/add-ons", icon: PuzzleIcon },
  { name: "Coupons", href: "/coupons", icon: Tag },
  { name: "Subscriptions", href: "/subscriptions", icon: Receipt },
  { name: "Invoices", href: "/invoices", icon: CreditCard },
  { name: "Wallets", href: "/wallets", icon: Wallet },
  { name: "Credit Notes", href: "/credit-notes", icon: FileText },
  { name: "Taxes", href: "/taxes", icon: Calculator },
  { name: "Plan Overrides", href: "/plan-overrides", icon: SlidersHorizontal },
  { name: "Payments", href: "/payments", icon: DollarSign },
  { name: "Providers", href: "/providers", icon: Plug },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:4003";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-lg">NovaBilling</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-accent",
              )}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* External Links */}
      <div className="px-2 pb-2">
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent transition-colors"
          title={sidebarCollapsed ? "Documentation" : undefined}
        >
          <BookOpen className="h-5 w-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Documentation</span>}
        </a>
      </div>

      {/* User Profile */}
      <div className="p-2 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors",
                sidebarCollapsed && "justify-center",
              )}
            >
              <Avatar name={user?.name || "User"} size="sm" />
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-card shadow-sm flex items-center justify-center hover:bg-muted"
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
