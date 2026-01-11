'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchKitchenByProject, addWall } from '@/lib/features/kitchens/kitchenSlice'; // Import addWall
import { fetchProjects } from '@/lib/features/projects/projectSlice';
import ElevationEngine from '@/components/kitchen/ElevationEngine'; // Import your engine

export default function ProjectDetail() {
    const { id } = useParams();
    const dispatch = useAppDispatch();

    const { currentKitchen, loading: kitchenLoading } = useAppSelector((state) => state.kitchen);
    const { items: projects } = useAppSelector((state) => state.projects);

    const projectInfo = projects.find(p => p._id === id);

    useEffect(() => {
        if (id) {
            dispatch(fetchKitchenByProject(id as string));
            if (projects.length === 0) dispatch(fetchProjects());
        }
    }, [id, dispatch, projects.length]);

    // TRIGGER: This function kicks off the Redux state
    const handleInitialize = () => {
        dispatch(addWall({ projectId: id as string }));
    };

    if (kitchenLoading) return (
        <div className="flex h-screen items-center justify-center bg-black text-magic-purple font-mono animate-pulse uppercase tracking-[0.5em]">
            Syncing_Node...
        </div>
    );

    return (
        <main className="min-h-screen p-6 lg:p-10 space-y-8 bg-obsidian">
            {/* HEADER */}
            <header className="glass-brilliant p-8 rounded-[2rem] border-white/5 flex justify-between items-end">
                <div>
                    <span className="text-[10px] font-black tracking-[0.3em] text-magic-purple uppercase">Active_Sequence</span>
                    <h1 className="text-4xl font-black italic tracking-tighter text-white">
                        {projectInfo?.name || "Initializing..."}
                    </h1>
                    <p className="text-white/40 font-mono text-sm mt-1 uppercase tracking-wider">
                        Target: {projectInfo?.client || "Unknown_Client"}
                    </p>
                </div>

                <div className="hidden md:block text-right">
                    <div className="text-[8px] text-white/20 mb-1 font-black uppercase tracking-[0.2em]">System_Status</div>
                    <span className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-emerald-500/10 text-emerald-400">
                        {currentKitchen?.status || 'Active'}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* THE CANVAS AREA */}
                <section className="lg:col-span-8 glass-brilliant min-h-[600px] rounded-[3rem] border-white/5 p-8 relative overflow-y-auto">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20">Spatial_Blueprint_v1.0</h2>
                    </div>

                    {/* CHANGE: Check for walls specifically to trigger the engine */}
                    {currentKitchen && currentKitchen.walls.length > 0 ? (
                        <ElevationEngine kitchen={currentKitchen} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-white/5 rounded-[2rem] py-20">
                            <p className="text-white/30 font-mono text-sm mb-6 uppercase tracking-widest">No_Kitchen_Model_Detected</p>
                            <button
                                onClick={handleInitialize}
                                className="px-8 py-3 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all text-xs uppercase cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                Build_Initial_Model
                            </button>
                        </div>
                    )}
                </section>

                {/* SIDEBAR */}
                <aside className="lg:col-span-4 space-y-6">
                    <div className="glass-brilliant p-6 rounded-[2rem] border-white/5">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 font-mono">Module_Constraints</h3>
                        <div className="space-y-4">
                            <StatRow label="Counter_Depth" value={`${currentKitchen?.standards?.baseCabinetDepth || 60}cm`} />
                            <StatRow label="Upper_Depth" value={`${currentKitchen?.standards?.wallCabinetDepth || 35}cm`} />
                            {/* ADDED INFO */}
                            <div className="pt-4 border-t border-white/5 mt-4">
                                <div className="text-[8px] text-white/20 uppercase mb-2 font-black">Spatial_Stats</div>
                                <p className="text-[10px] text-white/50">Walls: {currentKitchen?.walls.length || 0}</p>
                                <p className="text-[10px] text-white/50">Obstacles: {currentKitchen?.obstacles.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

function StatRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-xs text-white/50 font-mono uppercase">{label}</span>
            <span className="text-xs font-black text-white">{value}</span>
        </div>
    );
}