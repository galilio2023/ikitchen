import { Database, Zap, Cpu, Activity } from "lucide-react";
import MagicStatsCard from "@/components/dashboard/MagicStatsCard";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import { getProjects, getProjectStats } from "@/services/projectService";

export default async function DashboardPage() {
  const projects = await getProjects();
  const stats = await getProjectStats(projects);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-10">
      {/* Hero / Stats Section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your kitchen design operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <MagicStatsCard
            title="Active Drafts"
            value={(stats.total - stats.completed).toString()}
            iconName="activity"
            color="amber"
          />
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/40 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-border/40 bg-card/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Recent Projects
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and track your ongoing designs.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-background/50">
          {/* Hide search on dashboard for a cleaner look, and show only recent ones */}
          <ProjectGrid projects={projects} showSearch={false} limit={4} />
        </div>
      </div>
    </div>
  );
}
