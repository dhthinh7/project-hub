// Script to create a zip file of local-server for distribution
// This now packages the executable version

const fs = require("fs");
const path = require("path");

let archiver;
try {
  archiver = require("archiver");
} catch (error) {
  console.error("Error: archiver package not found!");
  console.log("Please install it: npm install archiver --save-dev");
  process.exit(1);
}

const publicDir = path.join(__dirname, "..", "public");
const exeFile = path.join(publicDir, "local-server.exe");
const outputFile = path.join(publicDir, "local-server.zip");

console.log("Creating local-server package...");

// Check if executable exists
if (!fs.existsSync(exeFile)) {
  console.error("Error: local-server.exe not found!");
  console.log("Please run: npm run build:server-exe first");
  process.exit(1);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Remove old zip if exists
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
}

// Create a file to stream archive data to
const output = fs.createWriteStream(outputFile);
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level
});

// Listen for all archive data to be written
output.on("close", () => {
  console.log(`✓ Package created: ${outputFile}`);
  console.log(`  Total size: ${archive.pointer()} bytes`);
  const stats = fs.statSync(outputFile);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`  File size: ${fileSizeInMB} MB`);
});

archive.on("error", (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the executable and a README
archive.file(exeFile, { name: "local-server.exe" });

// Create a simple README for the package
const readmeContent = `# Local Server for Project Manager

## Quick Start

1. Extract this zip file to a folder
2. Double-click local-server.exe
3. The server will start automatically on http://localhost:1234
4. Keep this window open while using the web app

## Notes

- This is a standalone executable - no Node.js installation required
- The server must be running for the web app to work
- Close the server window to stop the server
- Projects are stored in projects.json in the same folder as the executable
`;

archive.append(readmeContent, { name: "README.txt" });

// Finalize the archive
archive.finalize();
