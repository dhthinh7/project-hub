// Client-side API to communicate with local server

const LOCAL_SERVER_URL = "http://localhost:1234";

export interface Project {
  name: string;
  path: string;
  pathValid?: boolean;
}

export interface ServerHealth {
  status: string;
  port: number;
  version: string;
}

export async function checkLocalServer(): Promise<boolean> {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getServerHealth(): Promise<ServerHealth | null> {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

export async function openProject(path: string, type: "vscode" | "cursor" | "terminal"): Promise<boolean> {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/open`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, type }),
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to open project:", error);
    return false;
  }
}

export async function loadProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/projects`, {
      method: "GET",
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    if (!response.ok) {
      throw new Error("Failed to load projects");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load projects:", error);
    return [];
  }
}

export async function addProject(project: { name: string; path: string }): Promise<Project | null> {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add project");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to add project:", error);
    throw error;
  }
}

export async function updateProject(id: number, project: { name: string; path: string }): Promise<Project | null> {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update project");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update project:", error);
    throw error;
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/projects/${id}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to delete project:", error);
    return false;
  }
}

export async function checkPath(path: string): Promise<boolean> {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/check-path`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.valid || false;
  } catch (error) {
    console.error("Failed to check path:", error);
    return false;
  }
}
