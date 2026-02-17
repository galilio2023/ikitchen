"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowUpRight, Trash2, Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { deleteProject } from "@/actions/projectActions";
import { toast } from "sonner";
import DeleteConfirmationDialog from "@/components/dashboard/DeleteConfirmationDialog";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  clientName?: string;
  status?: string;
  progress?: number;
  updatedAt?: Date;
  createdAt?: Date;
}

interface EnterpriseProjectCardProps {
  project: Project;
}

export default function EnterpriseProjectCard({
  project,
}: EnterpriseProjectCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProject(project.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Project deleted.");
      }
      setIsDeleteDialogOpen(false);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'draft': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle2 size={14} />;
      case 'in progress': return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  // Fallback to createdAt if updatedAt is missing, or current date as last resort
  const displayDate = project.updatedAt || project.createdAt || new Date();

  return (
    <>
      <Link
        href={`/editor/${project.id}`}
        className="card-container block group relative overflow-hidden rounded-xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-border/40 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-1"
      >
        {/* Thumbnail Placeholder */}
        <div className="h-32 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card/60 to-transparent" />
        </div>

        <div className="p-6 pt-4 relative">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-foreground/90 truncate pr-8">
              {project.clientName || "Untitled Project"}
            </h3>
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
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

          <div className="flex items-center gap-2 mb-4">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5",
              getStatusColor(project.status || 'draft')
            )}>
              {getStatusIcon(project.status || 'draft')}
              {project.status || "Draft"}
            </span>
            <span className="text-xs text-muted-foreground">
              Updated {new Date(displayDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{project.progress || 0}%</span>
            </div>
            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/80 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </Link>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to permanently delete this project? This action cannot be undone."
      />
    </>
  );
}
