"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowUpRight, Trash2, Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { deleteProject } from "@/actions/projectActions";
import { toast } from "sonner";
import DeleteConfirmationDialog from "@/components/dashboard/DeleteConfirmationDialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      case 'completed': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'designing':
      case 'in progress': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'draft': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="h-full"
      >
        <Link
          href={`/editor/${project.id}`}
          className="group relative flex flex-col h-full bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 text-right"
          dir="rtl"
        >
          {/* Spotlight Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
          
          {/* Header Section */}
          <div className="p-5 flex justify-between items-start gap-4 relative z-10">
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-extrabold text-foreground text-sm tracking-tight truncate group-hover:text-primary transition-colors">
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
          <div className="mt-auto px-5 pb-5 relative z-10">
            <div className="flex justify-between items-end mb-2 text-[11px]" dir="rtl">
              <span className="text-muted-foreground font-bold">نسبة التقدم</span>
              <span className="font-mono font-black text-foreground">{project.progress || 0}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress || 0}%` }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-l from-primary/80 to-primary rounded-full"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-border/40 flex justify-between items-center text-[10px]" dir="rtl">
               <span className="text-muted-foreground font-bold uppercase tracking-wider">
                آخر تحديث
              </span>
              <span className="font-mono font-bold text-foreground/70" suppressHydrationWarning>
                {new Date(displayDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

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
