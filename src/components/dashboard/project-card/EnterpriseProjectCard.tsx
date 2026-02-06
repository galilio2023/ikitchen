'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Trash2, Loader2 } from 'lucide-react';
import { deleteProject } from '@/actions/projectActions';
import { toast } from 'sonner';

interface Project {
    id: string;
    clientName?: string;
    status?: string;
    progress?: number;
}

interface EnterpriseProjectCardProps {
    project: Project;
}

export default function EnterpriseProjectCard({ project }: EnterpriseProjectCardProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to permanently delete this project?')) {
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
        <Link href={`/projects/${project.id}`} className="card block group">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{project.clientName || "Untitled Project"}</h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleDelete} disabled={isPending} className="btn btn-destructive btn-sm p-2">
                            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                        <ArrowUpRight size={18} className="text-muted-foreground" />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    Status: {project.status || "Draft"}
                </p>
            </div>
            <div className="px-6 pb-6">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary"
                        style={{ width: `${project.progress || 0}%` }}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{project.progress || 0}% Complete</p>
            </div>
        </Link>
    );
}
