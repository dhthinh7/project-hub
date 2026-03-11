// Local server to handle opening VSCode, Cursor, and Terminal
// Run this on user's machine: node server.js

const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");

const execAsync = promisify(exec);
const app = express();
const PORT = 1234;

// Path to projects storage file
// When packaged as executable, store in the same directory as the executable
// Otherwise, store in the current working directory
function getProjectsFilePath() {
  // Check if we're running as a pkg executable
  if (process.pkg) {
    // Store next to the executable
    return path.join(path.dirname(process.execPath), "projects.json");
  } else {
    // Store in the same directory as server.js
    return path.join(__dirname, "projects.json");
  }
}

const PROJECTS_FILE = getProjectsFilePath();

// Enable CORS for all origins (since frontend will be on different domain)
app.use(cors());
app.use(express.json());

// Helper functions for projects storage
function loadProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

function saveProjects(projects) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving projects:", error);
    return false;
  }
}

// Helper function to check if path exists
function checkPathExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
  } catch (error) {
    return false;
  }
}

app.post("/open", async (req, res) => {
  try {
    const { path, type } = req.body;

    if (!path || !type) {
      return res.status(400).json({ error: "Path and type are required" });
    }

    let command = "";

    if (type === "vscode") {
      command = `code "${path}"`;
    } else if (type === "cursor") {
      command = `cursor "${path}"`;
    } else if (type === "terminal") {
      // Windows
      if (process.platform === "win32") {
        command = `start cmd /K cd /d "${path}"`;
      } else if (process.platform === "darwin") {
        // macOS
        command = `open -a Terminal "${path}"`;
      } else {
        // Linux
        command = `gnome-terminal --working-directory="${path}" || xterm -e "cd '${path}' && bash"`;
      }
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    // Execute command asynchronously (don't wait for it)
    execAsync(command).catch((error) => {
      console.error(`Failed to execute command: ${error.message}`);
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error opening project:", error);
    res.status(500).json({ error: "Failed to open project" });
  }
});

app.get("/health", (req, res) => {
  // Read version from package.json
  const packageJson = require("./package.json");
  res.json({ 
    status: "ok", 
    port: PORT,
    version: packageJson.version || "1.0.0"
  });
});

// Projects CRUD endpoints
app.get("/projects", (req, res) => {
  try {
    const projects = loadProjects();
    // Check path validity for each project
    const projectsWithStatus = projects.map((project) => ({
      ...project,
      pathValid: checkPathExists(project.path),
    }));
    res.json(projectsWithStatus);
  } catch (error) {
    console.error("Error loading projects:", error);
    res.status(500).json({ error: "Failed to load projects" });
  }
});

app.post("/projects", (req, res) => {
  try {
    const { name, path: projectPath } = req.body;

    if (!name || !projectPath) {
      return res.status(400).json({ error: "Name and path are required" });
    }

    const projects = loadProjects();

    // Check if project with same name or path already exists
    if (projects.some((p) => p.name === name || p.path === projectPath)) {
      return res.status(400).json({ error: "Project with this name or path already exists" });
    }

    const newProject = {
      name,
      path: projectPath,
      pathValid: checkPathExists(projectPath),
    };

    projects.push(newProject);

    if (saveProjects(projects)) {
      res.json(newProject);
    } else {
      res.status(500).json({ error: "Failed to save project" });
    }
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ error: "Failed to add project" });
  }
});

app.put("/projects/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, path: projectPath } = req.body;

    if (!name || !projectPath) {
      return res.status(400).json({ error: "Name and path are required" });
    }

    const projects = loadProjects();
    const index = parseInt(id);

    if (index < 0 || index >= projects.length) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if another project with same name or path exists
    if (projects.some((p, i) => i !== index && (p.name === name || p.path === projectPath))) {
      return res.status(400).json({ error: "Project with this name or path already exists" });
    }

    const updatedProject = {
      name,
      path: projectPath,
      pathValid: checkPathExists(projectPath),
    };

    projects[index] = updatedProject;

    if (saveProjects(projects)) {
      res.json(updatedProject);
    } else {
      res.status(500).json({ error: "Failed to update project" });
    }
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

app.delete("/projects/:id", (req, res) => {
  try {
    const { id } = req.params;
    const projects = loadProjects();
    const index = parseInt(id);

    if (index < 0 || index >= projects.length) {
      return res.status(404).json({ error: "Project not found" });
    }

    projects.splice(index, 1);

    if (saveProjects(projects)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to delete project" });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Check path validity endpoint
app.post("/check-path", (req, res) => {
  try {
    const { path: filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({ error: "Path is required" });
    }
    const isValid = checkPathExists(filePath);
    res.json({ valid: isValid });
  } catch (error) {
    console.error("Error checking path:", error);
    res.status(500).json({ error: "Failed to check path" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure this server is running to open projects from the web app`);
});
