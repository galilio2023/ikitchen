import { Database, Zap, Cpu } from "lucide-react";
import MagicStatsCard from "@/components/dashboard/MagicStatsCard";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import { getProjects, getProjectStats } from "@/services/projectService";

export default async function DashboardPage() {
  const projects = await getProjects();
  const stats = await getProjectStats(projects);

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
        <div className="p-6 border-b border-border/10">
          <h2 className="text-xl font-semibold text-foreground">
            Your Projects
          </h2>
        </div>
        <div className="p-6">
          <ProjectGrid projects={projects} />
        </div>
      </div>
    </div>
  );
}
