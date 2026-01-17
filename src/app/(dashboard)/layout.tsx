// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";

import { getSession } from "@/lib/get-session";

import { Navbar } from "./dashboard/components/navbar";
import { Sidebar } from "./dashboard/components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
