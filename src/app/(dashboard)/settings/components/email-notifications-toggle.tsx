"use client";

import { Switch } from "@/components/ui/switch";

export function EmailNotificationsToggle() {
  return (
    <Switch
      defaultChecked
      onCheckedChange={(checked) => {
        // TODO: salvar preferência no backend
        console.log("Email notifications:", checked);
      }}
    />
  );
}
