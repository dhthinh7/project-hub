"use client";

import { useState } from "react";
import { X, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WELCOME_BANNER_KEY = "projecthub-hide-welcome";

export function WelcomeBanner() {
  const [showBanner, setShowBanner] = useState<boolean>(() => {
    // Only check localStorage on client side
    if (typeof window === "undefined") {
      return false;
    }
    const hideBanner = localStorage.getItem(WELCOME_BANNER_KEY);
    return hideBanner === null;
  });

  const handleDontShowAgain = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WELCOME_BANNER_KEY, "true");
    }
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <Card className="mb-6 border-blue-500/50 bg-blue-500/10 animate-in slide-in-from-top-2 duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <CardTitle className="text-lg">Welcome to ProjectHub!</CardTitle>
              <CardDescription className="mt-1">Manage and quickly open your development projects</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <p className="font-medium">ProjectHub helps you:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>
              <strong>Manage projects:</strong> Add, edit, and delete your development projects with ease
            </li>
            <li>
              <strong>Quick access:</strong> Open projects in VSCode, Cursor, or Terminal with a single click
            </li>
            <li>
              <strong>Search:</strong> Quickly find projects by name
            </li>
            <li>
              <strong>Local storage:</strong> All data is stored on your computer, no login required
            </li>
          </ul>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium">How to use:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
            <li>Download and run the Local Server (.exe file) to connect to the app</li>
            <li>Add your projects by clicking the &quot;Add Project&quot; button</li>
            <li>Open projects in your favorite editor</li>
          </ol>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleDontShowAgain} className="text-xs">
            Don&apos;t show again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
