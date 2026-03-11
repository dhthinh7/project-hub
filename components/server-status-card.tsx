"use client";

import { AlertCircle, CheckCircle2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServerStatusCardProps {
  localServerConnected: boolean | null;
  checkingServer: boolean;
  downloading: boolean;
  versionMismatch: boolean;
  serverVersion: string | null;
  onDownloadServer: () => void;
  onCheckConnection: () => void;
}

export function ServerStatusCard({
  localServerConnected,
  checkingServer,
  downloading,
  versionMismatch,
  serverVersion,
  onDownloadServer,
  onCheckConnection,
}: ServerStatusCardProps) {
  if (localServerConnected === false) {
    return (
      <Card className={`mb-6 ${versionMismatch ? 'border-red-500/50 bg-red-500/10' : 'border-yellow-500/50 bg-yellow-500/10'}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className={`h-5 w-5 ${versionMismatch ? 'text-red-500' : 'text-yellow-500'}`} />
            <CardTitle className="text-lg">
              {versionMismatch ? "Local Server Version Mismatch" : "Local Server Not Connected"}
            </CardTitle>
          </div>
          <CardDescription>
            {versionMismatch
              ? `Your local server version (${serverVersion}) does not match the required version. Please download and run the latest version.`
              : "To open projects, you need to run the local server on your machine."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {versionMismatch && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm">
              <p className="font-semibold mb-1 text-red-600 dark:text-red-400">⚠️ Action Required:</p>
              <p className="text-muted-foreground">
                The local server is running but has an incompatible version. All operations are disabled until you update to the latest version.
              </p>
            </div>
          )}
          <div className="space-y-2 text-sm">
            <p className="font-medium">Quick Setup:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
              <li>Click the button below to download the local server executable</li>
              <li>
                Double-click <code className="bg-muted px-1 py-0.5 rounded">local-server.exe</code> to run
              </li>
              <li>
                The server will start automatically on{" "}
                <code className="bg-muted px-1 py-0.5 rounded">http://localhost:1234</code>
              </li>
              <li>Keep the server window open while using the app</li>
            </ol>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onDownloadServer}
              disabled={downloading}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading ? "Downloading..." : "Download Local Server"}
            </Button>
            <Button variant="outline" size="sm" onClick={onCheckConnection} disabled={checkingServer}>
              {checkingServer ? "Checking..." : "Check Again"}
            </Button>
          </div>
          <div className="mt-2 p-3 bg-muted rounded-md text-xs">
            <p className="font-semibold mb-1">Note:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>This is a standalone executable - no Node.js installation required</li>
              <li>All project data is stored in a local file on your computer</li>
              <li>The server must be running to manage projects</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (localServerConnected === true) {
    return (
      <Card className="mb-6 border-green-500/50 bg-green-500/10">
        <CardContent className="py-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-500">Local server connected</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
