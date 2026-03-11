import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Serve the pre-built executable or zip file
export async function GET() {
  try {
    // First, try to serve the executable directly
    const exePath = join(process.cwd(), "public", "local-server.exe");
    if (existsSync(exePath)) {
      const exeBuffer = readFileSync(exePath);
      return new NextResponse(exeBuffer, {
        headers: {
          "Content-Type": "application/x-msdownload",
          "Content-Disposition": "attachment; filename=local-server.exe",
          "Content-Length": exeBuffer.length.toString(),
        },
      });
    }

    // Fallback: try to serve the zip file (contains executable + README)
    const zipPath = join(process.cwd(), "public", "local-server.zip");
    if (existsSync(zipPath)) {
      const zipBuffer = readFileSync(zipPath);
      return new NextResponse(zipBuffer, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": "attachment; filename=local-server.zip",
          "Content-Length": zipBuffer.length.toString(),
        },
      });
    }

    // If neither exists, return instructions
    const fallbackPackage = {
      name: "project-manager-local-server",
      version: "1.0.0",
      description: "Local server for Project Manager",
      instructions: {
        windows: "Please build the executable using: npm run build:server-package",
        note: "The executable will be packaged as a standalone .exe file that users can run without Node.js",
      },
      buildCommand: "npm run build:server-package",
    };

    return NextResponse.json(fallbackPackage, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=local-server-instructions.json",
      },
    });
  } catch (error) {
    console.error("Error serving download:", error);
    return NextResponse.json({ error: "Failed to serve download" }, { status: 500 });
  }
}
