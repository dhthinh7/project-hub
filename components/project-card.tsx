"use client";

import { Code, Terminal, Edit, Trash2, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "@/lib/storage";

interface ProjectCardProps {
  project: Project;
  index: number;
  isEditing: boolean;
  editProject: { name: string; path: string };
  localServerConnected: boolean | null;
  versionMismatch: boolean;
  onEditChange: (project: { name: string; path: string }) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onOpenProject: (path: string, type: "vscode" | "cursor" | "terminal") => void;
}

export function ProjectCard({
  project,
  index,
  isEditing,
  editProject,
  localServerConnected,
  versionMismatch,
  onEditChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onOpenProject,
}: ProjectCardProps) {
  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-in slide-in-from-bottom-4 ${
        project.pathValid === false ? "border-red-500/50 bg-red-500/5" : ""
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl truncate">{project.name}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">{project.path}</p>
            {project.pathValid === false && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                <span>Path not found</span>
              </div>
            )}
            {project.pathValid === true && (
              <div className="flex items-center gap-1 mt-1 text-xs text-green-500">
                <CheckCircle2 className="h-3 w-3" />
                <span>Path valid</span>
              </div>
            )}
          </div>
          {!isEditing && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onStartEdit}
                className="h-8 w-8 p-0"
                disabled={!localServerConnected || versionMismatch}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                disabled={!localServerConnected || versionMismatch}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Input
              placeholder="Project name"
              value={editProject.name}
              onChange={(e) => onEditChange({ ...editProject, name: e.target.value })}
            />
            <Input
              placeholder="Folder path"
              value={editProject.path}
              onChange={(e) => onEditChange({ ...editProject, path: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={onSaveEdit} size="sm" className="flex-1">
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={onCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenProject(project.path, "vscode")}
              className="flex-1 min-w-[100px]"
              disabled={!localServerConnected || project.pathValid === false}
            >
              <Code className="mr-2 h-3 w-3" />
              VSCode
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenProject(project.path, "cursor")}
              className="flex-1 min-w-[100px]"
              disabled={!localServerConnected || project.pathValid === false}
            >
              <Code className="mr-2 h-3 w-3" />
              Cursor
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenProject(project.path, "terminal")}
              className="flex-1 min-w-[100px]"
              disabled={!localServerConnected || project.pathValid === false}
            >
              <Terminal className="mr-2 h-3 w-3" />
              Terminal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
