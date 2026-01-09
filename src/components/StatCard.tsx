import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
}

 function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
    return (
        <Card className="bg-slate-950 border-none rounded-none hover:bg-slate-900 transition-colors group p-6 border-l-2 border-l-slate-800">
            <div className="flex flex-row items-center justify-between pb-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 group-hover:text-blue-400 transition-colors">
                    {label}
                </p>
                <div className={`${color} transition-transform group-hover:scale-110 duration-500`}>
                    <Icon size={18} strokeWidth={1.5} />
                </div>
            </div>
            <div className="text-3xl font-bold text-white tracking-tighter font-mono">
                {value}
            </div>
        </Card>
    );
}

export default StatCard