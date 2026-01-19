// app/(dashboard)/settings/page.tsx
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/get-session";

import { DangerZone } from "./components/danger-zone";
import { EmailNotificationsToggle } from "./components/email-notifications-toggle";
import { UpdateProfileForm } from "./components/update-profile-form";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/authentication");
  }

  return (
    <div className="max-w-4xl space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProfileForm user={session.user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-muted-foreground text-sm">
                  Receive emails about your account activity
                </p>
              </div>
              {/* TODO: Add switch component */}
              <div className="text-muted-foreground text-sm">
                <EmailNotificationsToggle />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-muted-foreground text-sm">Select your preferred language</p>
              </div>
              <div className="text-muted-foreground text-sm">English (US)</div>
            </div>
          </div>
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
    </div>
  );
}
