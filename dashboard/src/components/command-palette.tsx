"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  Users,
  Package,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { Command } from "cmdk";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUIStore } from "@/lib/stores/ui";

const quickActions = [
  {
    id: "customers",
    label: "View Customers",
    href: "/customers",
    icon: Users,
  },
  { id: "plans", label: "View Plans", href: "/plans", icon: Package },
  {
    id: "subscriptions",
    label: "View Subscriptions",
    href: "/subscriptions",
    icon: Receipt,
  },
  {
    id: "invoices",
    label: "View Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    id: "analytics",
    label: "View Analytics",
    href: "/analytics",
    icon: TrendingUp,
  },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandOpen, setCommandOpen } = useUIStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandOpen, setCommandOpen]);

  function handleSelect(href: string) {
    setCommandOpen(false);
    router.push(href);
  }

  return (
    <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl">
        <Command className="rounded-lg border-0">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Search or jump to..."
              value={search}
              onValueChange={setSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            <Command.Group heading="Quick Actions" className="mb-2">
              {quickActions.map((action) => (
                <Command.Item
                  key={action.id}
                  onSelect={() => handleSelect(action.href)}
                  className="flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer hover:bg-accent aria-selected:bg-accent"
                >
                  <action.icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
