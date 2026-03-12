// Script to build project-hub-local-server as executable using pkg
// This creates a standalone .exe file that users can run without Node.js installed

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const localServerDir = path.join(__dirname, "..", "project-hub-local-server");
const outputDir = path.join(__dirname, "..", "public");

console.log("Building project-hub-local-server executable...");
console.log("This may take a few minutes...\n");

try {
  // Change to project-hub-local-server directory
  process.chdir(localServerDir);

  // Check if pkg is installed
  try {
    require.resolve("pkg");
  } catch (error) {
    console.error("Error: pkg package not found!");
    console.log("Installing pkg...");
    execSync("npm install pkg --save-dev", { stdio: "inherit" });
  }

  // Build Windows executable
  console.log("Building Windows executable (server.exe)...");
  execSync("npm run build:exe", { stdio: "inherit" });

  // Move executable to public folder
  const exePath = path.join(localServerDir, "server.exe");
  const distExePath = path.join(outputDir, "project-hub-local-server.exe");

  if (fs.existsSync(exePath)) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.copyFileSync(exePath, distExePath);
    fs.unlinkSync(exePath); // Remove from project-hub-local-server directory
    console.log(`\n✓ Executable created: ${distExePath}`);
    
    const stats = fs.statSync(distExePath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`  File size: ${fileSizeInMB} MB`);
  } else {
    console.error("Error: Executable not found after build");
    process.exit(1);
  }

  console.log("\n✓ Build complete!");
  console.log("Users can now download and run project-hub-local-server.exe directly without Node.js");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
