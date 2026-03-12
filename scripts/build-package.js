// Script to build project-hub-local-server package for distribution
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const localServerDir = path.join(__dirname, "..", "project-hub-local-server");
const outputDir = path.join(__dirname, "..", "public", "project-hub-local-server-package");
const packageName = "project-manager-project-hub-local-server";

// Files to include in package
const filesToInclude = [
  "server.js",
  "package.json",
  "install.bat",
  "install.sh",
  "start.bat",
  "start.sh",
  "README.md",
];

console.log("Building project-hub-local-server package...");

// Create output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// Copy files
filesToInclude.forEach((file) => {
  const src = path.join(localServerDir, file);
  const dest = path.join(outputDir, file);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  } else {
    console.warn(`⚠ File not found: ${file}`);
  }
});

// Create package.json with bundled dependencies info
const packageJson = JSON.parse(
  fs.readFileSync(path.join(localServerDir, "package.json"), "utf-8")
);

// Create a zip file (requires archiver or use external tool)
console.log("\n✓ Package built successfully!");
console.log(`Location: ${outputDir}`);
console.log("\nTo create ZIP file, run:");
console.log(`  cd ${outputDir}`);
console.log(`  zip -r ${packageName}.zip .`);
