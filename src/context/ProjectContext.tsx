'use client';

import React, { createContext, useContext, useState } from 'react';
import { IProject } from '@/models/Project';
import { toast } from 'sonner';

interface ProjectContextType {
    projects: IProject[];
    loading: boolean;
    refreshProjects: () => Promise<void>;
    addProject: (payload: { name: string; client: string }) => Promise<boolean>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({
                                    children,
                                    initialData
                                }: {
    children: React.ReactNode;
    initialData: IProject[]
}) {
    const [projects, setProjects] = useState<IProject[]>(initialData);
    const [loading, setLoading] = useState(false);

    // Sync with DB
    const refreshProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            toast.error("SYNC_ERROR", { description: "Failed to pull latest sequence data." });
        }
    };

    // Injectable Service Method
    const addProject = async (payload: { name: string; client: string }) => {
        setLoading(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (res.ok) {
                toast.success("COMMITTED", { description: `${result.name} initialized.` });
                await refreshProjects();
                return true;
            } else {
                toast.error(result.error || "VALIDATION_FAILED", {
                    description: result.details?.join(", ") || result.message
                });
                return false;
            }
        } catch (error) {
            toast.error("FATAL_ERROR", { description: "Connection to core lost." });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProjectContext.Provider value={{ projects, loading, refreshProjects, addProject }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (!context) throw new Error("useProjects must be used within a ProjectProvider");
    return context;
};