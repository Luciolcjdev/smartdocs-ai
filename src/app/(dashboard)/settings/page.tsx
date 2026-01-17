// app/(dashboard)/settings/page.tsx
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

import { DangerZone } from "@/components/settings/danger-zone";
import { UpdateProfileForm } from "@/components/settings/update-profile-form";
import { PageTransition } from "@/components/shared/page-transition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/get-session";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/authentication");
  }

  return (
    <PageTransition>
      <div className="max-w-4xl space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        <Separator />
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateProfileForm user={session.user} />
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
            </CardHeader>
            <CardContent>
              <DangerZone />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
