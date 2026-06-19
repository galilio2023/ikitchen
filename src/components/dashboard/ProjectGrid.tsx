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

export default function ProjectGrid({ projects, showSearch = true, limit }: ProjectGridProps) {
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
    <div className="space-y-6" dir="rtl">
      {/* Optional Search Bar - Defaults to true for backward compatibility */}
      {showSearch && (
        <div className="relative max-w-md">
          <Search
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80"
            size={15}
          />
          <input
            type="text"
            placeholder="ابحث عن المشاريع باسم العميل أو حالة التصميم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-background border border-border rounded-xl focus:border-primary outline-none text-foreground text-xs transition-all placeholder:text-muted-foreground/60 shadow-sm text-right"
          />
        </div>
      )}

      {displayedProjects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-xs">
          لم يتم العثور على مشاريع تطابق "{searchQuery}"
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
