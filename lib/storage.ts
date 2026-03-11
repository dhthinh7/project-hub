// Client-side storage utilities - now using local server API
// This file is kept for backward compatibility but now delegates to local-api.ts

export type { Project } from "./local-api";
export { loadProjects, addProject, deleteProject, updateProject, checkPath } from "./local-api";
