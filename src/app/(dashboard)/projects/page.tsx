import React from 'react';
import { ChefHat, Database } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import EnterpriseProjectCard from '@/components/dashboard/project-card/EnterpriseProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';

// This page is now a Server Component that fetches its own data.
async function getProjects() {
  await dbConnect();
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
  // Ensure the data is serialized correctly for the client components
  return projects.map(p => ({ 
      id: p._id.toString(),
      clientName: p.clientName,
      status: p.status,
      progress: p.progress,
  }));
}

export default async function ProjectsVaultPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <ChefHat size={24} className="text-primary" />
                    <h1 className="text-2xl font-bold">
                        Project Vault
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Database size={16} />
                        <span>{projects.length} Projects</span>
                    </div>
                    <CreateProjectModal />
                </div>
            </header>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map((project) => (
                        <EnterpriseProjectCard
                            key={project.id}
                            project={project}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold">No Projects Found</h3>
                    <p className="text-sm text-muted-foreground mt-2">Get started by creating a new project.</p>
                </div>
            )}
        </div>
    );
}
