// components/dashboard/navbar.tsx
import { Bell } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";

import { CreditsBadge } from "./credits-badge";

export function Navbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-6 dark:bg-gray-950">
      <div className="flex items-center gap-4">
        {/* Breadcrumb ou título da página pode ir aqui */}
      </div>

      <div className="flex items-center gap-4">
        <CreditsBadge workspaceId="temp-workspace-id" />
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
