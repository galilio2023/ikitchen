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
  return projects.map((p: any) => ({
    id: p._id.toString(),
    clientName: p.client, // Corrected property name from clientName to client
    status: p.status,
    progress: p.progress,
  }));
}

export default async function DashboardPage() {
  const projects = await getProjects();

  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.progress === 100).length,
    averageProgress:
      projects.length > 0
        ? Math.round(
            projects.reduce((acc, p) => acc + (p.progress || 0), 0) /
              projects.length,
          )
        : 0,
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MagicStatsCard
          title="Total Projects"
          value={stats.total.toString()}
          iconName="database"
          color="blue"
        />
        <MagicStatsCard
          title="Completed"
          value={stats.completed.toString()}
          iconName="zap"
          color="green"
        />
        <MagicStatsCard
          title="Average Progress"
          value={`${stats.averageProgress}`}
          unit="%"
          iconName="cpu"
          color="purple"
        />
      </div>

      <div className="bg-card/50 backdrop-blur-lg rounded-2xl shadow-lg border border-border/20">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground">
            Your Projects
          </h2>
        </div>
        <div className="p-6 !pt-0">
          <ProjectGrid projects={projects} />
        </div>
      </div>
    </div>
  );
}
