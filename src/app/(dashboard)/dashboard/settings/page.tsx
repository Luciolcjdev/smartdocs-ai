// app/(dashboard)/dashboard/settings/page.tsx
// import { DangerZone } from "@/components/settings/DangerZone";
// import { UpdateProfileForm } from "@/components/settings/UpdateProfileForm";
// import { WorkspaceSettings } from "@/components/settings/WorkspaceSettings";

import { PageTransition } from "@/components/shared/page-transition";

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="max-w-4xl p-8">
        <h1 className="mb-8 text-3xl font-bold">Settings</h1>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold">Profile</h2>
            {/* <UpdateProfileForm /> */}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Workspace</h2>
            {/* <WorkspaceSettings /> */}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-red-600">Danger Zone</h2>
            {/* <DangerZone /> */}
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
