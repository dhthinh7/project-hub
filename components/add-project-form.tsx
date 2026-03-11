"use client";

import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddProjectFormProps {
  project: { name: string; path: string };
  onProjectChange: (project: { name: string; path: string }) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AddProjectForm({ project, onProjectChange, onSubmit, onCancel }: AddProjectFormProps) {
  return (
    <Card className="mb-6 animate-in slide-in-from-top-2 duration-300">
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Project name"
          value={project.name}
          onChange={(e) => onProjectChange({ ...project, name: e.target.value })}
        />
        <Input
          placeholder="Folder path (e.g., C:\\path\\to\\project)"
          value={project.path}
          onChange={(e) => onProjectChange({ ...project, path: e.target.value })}
        />
        <div className="flex gap-2">
          <Button onClick={onSubmit} className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
