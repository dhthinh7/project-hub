"use client";

import { FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "./project-card";
import type { Project } from "@/lib/storage";

interface ProjectListProps {
  projects: Project[];
  filteredProjects: Project[];
  loadingProjects: boolean;
  searchQuery: string;
  editingIndex: number | null;
  editProject: { name: string; path: string };
  localServerConnected: boolean | null;
  versionMismatch: boolean;
  onEditChange: (project: { name: string; path: string }) => void;
  onStartEdit: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (index: number) => void;
  onOpenProject: (path: string, type: "vscode" | "cursor" | "terminal") => void;
}

export function ProjectList({
  projects,
  filteredProjects,
  loadingProjects,
  searchQuery,
  editingIndex,
  editProject,
  localServerConnected,
  versionMismatch,
  onEditChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onOpenProject,
}: ProjectListProps) {
  if (loadingProjects) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {searchQuery ? "No projects found matching your search" : "No projects yet. Add your first project!"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map((project, index) => {
        const actualIndex = projects.findIndex((p) => p.name === project.name && p.path === project.path);
        const isEditing = editingIndex === actualIndex;

        return (
          <ProjectCard
            key={`${project.name}-${actualIndex}`}
            project={project}
            index={index}
            isEditing={isEditing}
            editProject={editProject}
            localServerConnected={localServerConnected}
            versionMismatch={versionMismatch}
            onEditChange={onEditChange}
            onStartEdit={() => onStartEdit(actualIndex)}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDelete={() => onDelete(actualIndex)}
            onOpenProject={onOpenProject}
          />
        );
      })}
    </div>
  );
}
