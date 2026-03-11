"use client";

import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  loadProjects,
  addProject as addProjectToStorage,
  updateProject,
  deleteProject,
  type Project,
} from "@/lib/storage";
import { checkLocalServer, openProject as openProjectViaLocal, getServerHealth } from "@/lib/local-api";
import { downloadAndSetupServer } from "@/lib/download-server";
import { compareVersions, REQUIRED_SERVER_VERSION } from "@/lib/version";
import { WelcomeBanner } from "@/components/welcome-banner";
import { ServerStatusCard } from "@/components/server-status-card";
import { SearchBar } from "@/components/search-bar";
import { AddProjectForm } from "@/components/add-project-form";
import { ProjectList } from "@/components/project-list";
import { VersionBadge } from "@/components/version-badge";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({ name: "", path: "" });
  const [editProject, setEditProject] = useState({ name: "", path: "" });
  const [localServerConnected, setLocalServerConnected] = useState<boolean | null>(null);
  const [checkingServer, setCheckingServer] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [serverVersion, setServerVersion] = useState<string | null>(null);
  const [versionMismatch, setVersionMismatch] = useState(false);
  const prevConnectionStatus = useRef<boolean | null>(null);

  useEffect(() => {
    // Initial server connection check
    checkServerConnection();

    // Check server connection every 5 seconds
    const interval = setInterval(() => {
      checkServerConnection();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Only load projects when connection status actually changes
    // This prevents unnecessary reloads when checking connection periodically
    if (localServerConnected === true && prevConnectionStatus.current !== true) {
      // Connection just established - load projects
      loadProjectsFromStorage();
    } else if (localServerConnected === false && prevConnectionStatus.current !== false) {
      // Connection just lost - clear projects
      setProjects([]);
      setFilteredProjects([]);
    }
    // Update ref to track previous status
    prevConnectionStatus.current = localServerConnected;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  async function loadProjectsFromStorage() {
    if (!localServerConnected) {
      // Only load from local server - no localStorage fallback
      setProjects([]);
      setFilteredProjects([]);
      return;
    }

    // Prevent loading if already loading to avoid race conditions
    if (loadingProjects) {
      return;
    }

    setLoadingProjects(true);
    try {
      const data = await loadProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  }

  async function checkServerConnection() {
    setCheckingServer(true);
    const connected = await checkLocalServer();

    let actualConnectionStatus = connected;
    let versionMismatchStatus = false;
    let serverVersionValue: string | null = null;

    // Check version if connected
    if (connected) {
      const health = await getServerHealth();
      if (health) {
        serverVersionValue = health.version;
        const isVersionMatch = compareVersions(health.version, REQUIRED_SERVER_VERSION);
        console.log("isVersionMatch: ", isVersionMatch);
        versionMismatchStatus = !isVersionMatch;

        // If version mismatch, treat as disconnected to prevent access
        if (versionMismatchStatus) {
          actualConnectionStatus = false;
        }
      } else {
        serverVersionValue = null;
        versionMismatchStatus = false;
      }
    } else {
      serverVersionValue = null;
      versionMismatchStatus = false;
    }

    // Update states
    setServerVersion(serverVersionValue);
    setVersionMismatch(versionMismatchStatus);

    // Only update state if connection status actually changed
    // This prevents unnecessary re-renders and project reloads
    setLocalServerConnected((prev) => {
      if (prev === actualConnectionStatus) {
        // Status unchanged, return prev to avoid triggering useEffect
        return prev;
      }
      // Status changed, will trigger useEffect to load/clear projects
      return actualConnectionStatus;
    });

    setCheckingServer(false);
  }

  async function handleAddProject() {
    if (!newProject.name || !newProject.path) {
      alert("Please fill in both name and path");
      return;
    }

    if (!localServerConnected) {
      alert("Local server is not connected. Please start the local server first.");
      return;
    }

    if (versionMismatch) {
      alert("Please update your local server to the latest version to add projects.");
      return;
    }

    try {
      await addProjectToStorage(newProject);
      setNewProject({ name: "", path: "" });
      setIsAdding(false);
      await loadProjectsFromStorage();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to add project");
      }
    }
  }

  function handleEditProject(index: number) {
    const project = projects[index];
    setEditProject({ name: project.name, path: project.path });
    setEditingIndex(index);
  }

  async function handleUpdateProject() {
    if (!editProject.name || !editProject.path) {
      alert("Please fill in both name and path");
      return;
    }

    if (editingIndex === null || !localServerConnected) {
      return;
    }

    if (versionMismatch) {
      alert("Please update your local server to the latest version to update projects.");
      return;
    }

    try {
      await updateProject(editingIndex, editProject);
      setEditProject({ name: "", path: "" });
      setEditingIndex(null);
      await loadProjectsFromStorage();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to update project");
      }
    }
  }

  async function handleDeleteProject(index: number) {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    if (!localServerConnected) {
      alert("Local server is not connected. Please start the local server first.");
      return;
    }

    if (versionMismatch) {
      alert("Please update your local server to the latest version to delete projects.");
      return;
    }

    try {
      await deleteProject(index);
      await loadProjectsFromStorage();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to delete project");
      }
    }
  }

  async function handleOpenProject(path: string, type: "vscode" | "cursor" | "terminal") {
    const success = await openProjectViaLocal(path, type);
    if (!success) {
      alert("Failed to open project. Make sure the local server is running.");
    }
  }

  async function handleDownloadServer() {
    setDownloading(true);
    try {
      const success = await downloadAndSetupServer();
      if (success) {
        // Check connection after a delay
        setTimeout(() => {
          checkServerConnection();
        }, 2000);
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                🚀 ProjectHub
              </h1>
              <VersionBadge />
            </div>
            <p className="text-muted-foreground">Manage and open your development projects</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Local Server Status */}
        <ServerStatusCard
          localServerConnected={localServerConnected}
          checkingServer={checkingServer}
          downloading={downloading}
          versionMismatch={versionMismatch}
          serverVersion={serverVersion}
          onDownloadServer={handleDownloadServer}
          onCheckConnection={checkServerConnection}
        />

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Add Project Form */}
        {isAdding && (
          <AddProjectForm
            project={newProject}
            onProjectChange={setNewProject}
            onSubmit={handleAddProject}
            onCancel={() => {
              setIsAdding(false);
              setNewProject({ name: "", path: "" });
            }}
          />
        )}

        {/* Add Button */}
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="mb-6"
            size="lg"
            disabled={versionMismatch || !localServerConnected}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        )}

        {/* Projects List */}
        <ProjectList
          projects={projects}
          filteredProjects={filteredProjects}
          loadingProjects={loadingProjects}
          searchQuery={searchQuery}
          editingIndex={editingIndex}
          editProject={editProject}
          localServerConnected={localServerConnected}
          versionMismatch={versionMismatch}
          onEditChange={setEditProject}
          onStartEdit={handleEditProject}
          onSaveEdit={handleUpdateProject}
          onCancelEdit={() => {
            setEditingIndex(null);
            setEditProject({ name: "", path: "" });
          }}
          onDelete={handleDeleteProject}
          onOpenProject={handleOpenProject}
        />
      </div>
    </div>
  );
}
