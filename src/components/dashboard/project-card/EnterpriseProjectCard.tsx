"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { ArrowUpRight, Trash2, Loader2 } from "lucide-react";
import { deleteProject } from "@/actions/projectActions";
import { toast } from "sonner";

interface Project {
  id: string;
  clientName?: string;
  status?: string;
  progress?: number;
}

interface EnterpriseProjectCardProps {
  project: Project;
}

export default function EnterpriseProjectCard({
  project,
}: EnterpriseProjectCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to permanently delete this project?",
      )
    ) {
      startTransition(async () => {
        const result = await deleteProject(project.id);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Project deleted.");
        }
      });
    }
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-container block group relative overflow-hidden rounded-xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-border/40 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-foreground/90">
            {project.clientName || "Untitled Project"}
          </h3>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="p-2 rounded-md hover:bg-destructive/20 text-destructive transition-colors"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
            <ArrowUpRight
              size={18}
              className="text-muted-foreground group-hover:text-foreground"
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Status:{" "}
          <span className="font-medium text-foreground/70">
            {project.status || "Draft"}
          </span>
        </p>
      </div>
      <div className="px-6 pb-6 mt-auto">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-muted-foreground">
            {project.progress || 0}% Complete
          </p>
        </div>
        <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
