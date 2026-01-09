import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IProject } from "@/models/Project";

interface ProjectCardProps extends Pick<IProject, "name" | "client" | "status" | "progress"> {
    index?: number;
}

 function ProjectCard({ name, client, status, progress, index = 0 }: ProjectCardProps) {
    return (
        <Card
            style={{ animationDelay: `${index * 75}ms` }}
            className="bg-slate-900/20 border-slate-800 rounded-none group hover:bg-slate-900/40 transition-all border-t-2 border-t-transparent hover:border-t-blue-500 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
            <CardHeader className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold text-slate-200 group-hover:text-blue-400 transition-colors tracking-tight uppercase font-mono">
                            {name.replace(/\s+/g, '_')}
                        </CardTitle>
                        <CardDescription className="font-mono text-[10px] uppercase text-slate-500 flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                            Client: <span className="text-slate-300">{client}</span>
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-slate-700 text-slate-400 font-mono rounded-none text-[9px] bg-slate-950 px-2">
                        {status.toUpperCase()}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                        <span>Buffer_Capacity</span>
                        <span className="text-blue-500">{progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 overflow-hidden relative">
                        <div
                            className="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProjectCard