// Client-side utility to download and setup local server

export async function downloadAndSetupServer(): Promise<boolean> {
  try {
    // Download exe file
    const response = await fetch("/api/download-server");
    if (!response.ok) {
      throw new Error("Failed to download server package");
    }

    // Check content type
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/x-msdownload") || contentType?.includes("application/octet-stream")) {
      // Download as exe file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project-hub-local-server.exe";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show instructions for executable
      alert(
        `Local Server Downloaded!\n\n` +
          `Next steps:\n` +
          `1. Double-click project-hub-local-server.exe to run\n` +
          `2. The server will start automatically on http://localhost:1234\n` +
          `3. Keep the window open while using the app\n\n` +
          `Note: This is a standalone executable - no Node.js installation required!`
      );
    } else if (contentType?.includes("application/zip")) {
      // Fallback: zip file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project-hub-local-server.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(
        `Local Server Package Downloaded!\n\n` +
          `Next steps:\n` +
          `1. Extract the zip file to a folder\n` +
          `2. Double-click project-hub-local-server.exe\n` +
          `3. The server will start automatically on http://localhost:1234\n\n` +
          `Note: This is a standalone executable - no Node.js installation required!`
      );
    } else {
      // Fallback: JSON package
      const packageData = await response.json();
      const blob = new Blob([JSON.stringify(packageData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project-hub-local-server-package.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(
        `Package downloaded!\n\n` +
          `Note: This is a fallback package. Please build the executable using:\n` +
          `npm run build:server-package\n\n` +
          `Then the download will work properly.`
      );
    }

    return true;
  } catch (error) {
    console.error("Failed to download server:", error);
    alert("Failed to download server package. Please try again.");
    return false;
  }
}
