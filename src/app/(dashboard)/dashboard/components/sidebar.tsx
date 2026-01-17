// components/dashboard/Sidebar.tsx
import { CreditCard, FileText, Home, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">SmartDocs AI</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
