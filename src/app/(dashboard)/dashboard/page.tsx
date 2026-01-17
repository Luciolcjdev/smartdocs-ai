// app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";

import { UserMenu } from "@/components/shared/user-menu";
import { getSession } from "@/lib/get-session";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">Welcome back, {session.user.name}!</p>
      <UserMenu />
    </div>
  );
}
