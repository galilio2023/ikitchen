"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowUpRight, Trash2, Loader2, Clock, CheckCircle2, AlertCircle, MoreHorizontal } from "lucide-react";
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
      case 'completed': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'designing':
      case 'in progress': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'draft': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle2 size={12} />;
      case 'designing':
      case 'in progress': return <Clock size={12} />;
      default: return <AlertCircle size={12} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'تمت المعاينة';
      case 'designing':
      case 'in progress': return 'قيد التصميم';
      case 'draft': return 'مسودة';
      default: return status;
    }
  };

  const displayDate = project.updatedAt || project.createdAt || new Date();

  return (
    <>
      <Link
        href={`/editor/${project.id}`}
        className="group relative flex flex-col kitchen-card hover:border-primary/40 hover:scale-[1.01] transition-all duration-300 !p-0 overflow-hidden cursor-pointer shadow-sm hover:shadow-md text-right"
        dir="rtl"
      >
        {/* Header Section */}
        <div className="p-5 flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-sm tracking-tight truncate">
              {project.clientName || "تصميم بدون عنوان"}
            </h3>
            <div className="flex items-center gap-2 justify-start">
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 uppercase tracking-wider",
                getStatusColor(project.status || 'draft')
              )}>
                {getStatusIcon(project.status || 'draft')}
                {getStatusLabel(project.status || 'draft')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
             <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
                disabled={isPending}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
              <div className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowUpRight size={14} />
              </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-auto px-5 pb-5">
          <div className="flex justify-between items-end mb-2 text-[11px]" dir="rtl">
            <span className="text-muted-foreground font-bold">نسبة التقدم</span>
            <span className="font-mono font-bold text-foreground">{project.progress || 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-[10px]" dir="rtl">
             <span className="text-muted-foreground font-bold uppercase tracking-wider">
              آخر تحديث
            </span>
            <span className="font-mono font-medium text-foreground/80" suppressHydrationWarning>
              {new Date(displayDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </Link>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="حذف المشروع"
        description="هل أنت متأكد من رغبتك في حذف هذا المشروع نهائياً؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </>
  );
}
