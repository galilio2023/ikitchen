"use client";

import React, { useState } from "react";
import EnterpriseProjectCard from "./project-card/EnterpriseProjectCard";
import EmptyDashboard from "./EmptyDashboard";
import { Search } from "lucide-react";

interface Project {
  id: string;
  clientName: string;
  status: string;
  progress: number;
  updatedAt: Date;
}

interface ProjectGridProps {
  projects: Project[];
  showSearch?: boolean;
  limit?: number;
}

export default function ProjectGrid({ projects, showSearch = false, limit }: ProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(
    (project) =>
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  if (projects.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <div className="space-y-6">
      {/* Optional Search Bar */}
      {showSearch && (
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      )}

      {displayedProjects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No projects found matching "{searchQuery}"
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProjects.map((project) => (
            <EnterpriseProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
