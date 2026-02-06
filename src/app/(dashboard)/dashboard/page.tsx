import { Database, Zap, Cpu } from "lucide-react";
import MagicStatsCard from "@/components/dashboard/MagicStatsCard";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";

// This function now ensures the returned data is a plain object.
async function getProjects() {
  await dbConnect();
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
  
  // Manually map to a plain object to satisfy Server Component rules.
  return projects.map(p => ({ 
      id: p._id.toString(),
      clientName: p.clientName,
      status: p.status,
      progress: p.progress,
  }));
}

export default async function DashboardPage() {
    const projects = await getProjects();

    const stats = {
        total: projects.length,
        completed: projects.filter(p => p.progress === 100).length,
        averageProgress: projects.length > 0
            ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)
            : 0,
    };

    return (
        <div className="space-y-6 md:space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MagicStatsCard
                    title="Total Projects"
                    value={stats.total.toString()}
                    iconName="database" // Pass icon name as a string
                    color="blue"
                />
                <MagicStatsCard
                    title="Completed"
                    value={stats.completed.toString()}
                    iconName="zap" // Pass icon name as a string
                    color="green"
                />
                <MagicStatsCard
                    title="Average Progress"
                    value={`${stats.averageProgress}%`}
                    iconName="cpu" // Pass icon name as a string
                    color="purple"
                />
            </div>

            <div className="card bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50">
                    <h2 className="text-lg font-semibold text-foreground">Projects</h2>
                </div>
                <div className="p-6">
                    <ProjectGrid projects={projects} />
                </div>
            </div>
        </div>
    );
}
