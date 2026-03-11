"use client";

import { APP_VERSION } from "@/lib/version";

export function VersionBadge() {
  return (
    <div className="text-xs text-muted-foreground">
      v{APP_VERSION}
    </div>
  );
}
