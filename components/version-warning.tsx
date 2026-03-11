"use client";

import { AlertTriangle, Download, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_VERSION } from "@/lib/version";

interface VersionWarningProps {
  serverVersion: string;
  onDownload: () => void;
  onDismiss?: () => void;
}

export function VersionWarning({ serverVersion, onDownload, onDismiss }: VersionWarningProps) {
  return (
    <Card className="mb-6 border-red-500/50 bg-red-500/10 animate-in slide-in-from-top-2 duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <CardTitle className="text-lg text-red-500">Version Mismatch Detected</CardTitle>
              <CardDescription className="mt-1">
                Your local server version does not match the app version. Please update to continue.
              </CardDescription>
            </div>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss} className="h-8 w-8 p-0 flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <span className="font-medium">App Version:</span>
            <span className="text-muted-foreground">{APP_VERSION}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <span className="font-medium">Server Version:</span>
            <span className="text-red-500 font-semibold">{serverVersion}</span>
          </div>
        </div>
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-sm">
          <p className="font-semibold mb-1 text-yellow-600 dark:text-yellow-400">⚠️ Action Required:</p>
          <p className="text-muted-foreground">
            CRUD operations are disabled until you update your local server to version {APP_VERSION}. Please download
            and run the latest version of the local server.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={onDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download Latest Server
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
