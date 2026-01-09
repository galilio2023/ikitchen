import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  LayoutGrid,
  Activity,
  Clock,
  LucideIcon, // ✅ Import the specific type here
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic uppercase font-black">
            System_Overview
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1">
            Status:{" "}
            <span className="text-emerald-500 animate-pulse font-bold">
              ● Online
            </span>
            <span className="ml-4 tracking-widest text-slate-600 underline decoration-slate-800">
              KITCHEN_PRO_01
            </span>
          </p>
        </div>
        <Button className="bg-slate-100 text-slate-900 hover:bg-white rounded-none border-r-4 border-b-4 border-slate-400 font-bold px-8 transition-all active:translate-y-1 active:border-b-0">
          <Plus className="mr-2 h-4 w-4" /> INITIALIZE_NEW_PROJECT
        </Button>
      </header>

      {/* Stats Grid - Passing Icons as Component References */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total_Calculations"
          value="128"
          icon={Activity}
          color="text-blue-400"
        />
        <StatCard
          label="Active_Designs"
          value="12"
          icon={LayoutGrid}
          color="text-slate-200"
        />
        <StatCard
          label="Avg_Render_Time"
          value="4.2s"
          icon={Clock}
          color="text-emerald-400"
        />
      </div>

      {/* Main Workspace */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-tighter">
          <div className="h-[1px] w-8 bg-slate-800" />
          <span>Active_Project_Queue</span>
          <div className="h-[1px] flex-1 bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectCard
            name="Residence_Al_Maadi_V4"
            client="Ibrahim Galal"
            status="Measuring"
            progress={65}
          />
          <ProjectCard
            name="Office_Kitchenette_01"
            client="Sarah Chen"
            status="Draft"
            progress={20}
          />
        </div>
      </section>
    </div>
  );
}

/** * SENIOR REFACTOR:
 * Using 'LucideIcon' type and rendering as <Icon />
 */
interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon; // ✅ Strict Type
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="bg-slate-900/40 border-slate-800 rounded-none border-l-2 border-l-slate-700 hover:bg-slate-900/60 transition-colors group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
          {label}
        </CardTitle>
        <div className={`${color} transition-transform group-hover:scale-110`}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white tracking-tight">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectCardProps {
    name: string;
    client: string;
    status: "Draft" | "Measuring" | "Designing" | "Rendered" | "Completed";
    progress: number;
}

function ProjectCard({
                         name,
                         client,
                         status,
                         progress,
                     }: ProjectCardProps) {
  return (
    <Card className="bg-slate-900/20 border-slate-800 rounded-none group hover:bg-slate-900/40 transition-all cursor-pointer border-t-2 border-t-transparent hover:border-t-blue-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-slate-200 group-hover:text-blue-400 transition-colors tracking-tight">
              {name}
            </CardTitle>
            <CardDescription className="font-mono text-[10px] uppercase mt-1">
              Client: {client}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="border-slate-700 text-slate-400 font-normal rounded-none text-[10px] bg-slate-950 px-2 py-0"
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
            <span>Progress_Buffer</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-none overflow-hidden">
            <div
              className="h-full bg-slate-500 group-hover:bg-blue-500 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
