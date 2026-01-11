'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addObstacle, setSelectedObstacle } from '@/lib/features/kitchens/kitchenSlice';
import { ObstacleType } from '@/types';
import { Square, DoorOpen, Zap, Droplets, Columns2, Heater, ShieldAlert } from 'lucide-react';

export default function ObstacleToolbox({ wallIndex }: { wallIndex: number }) {
    const dispatch = useAppDispatch();
    const obstacles = useAppSelector(state => state.kitchen.currentKitchen?.obstacles || []);

    const tools = [
        { type: 'window' as ObstacleType, icon: Square, color: 'text-blue-400', label: 'Window' },
        { type: 'door' as ObstacleType, icon: DoorOpen, color: 'text-orange-400', label: 'Door' },
        { type: 'socket' as ObstacleType, icon: Zap, color: 'text-yellow-400', label: 'Power' },
        { type: 'water' as ObstacleType, icon: Droplets, color: 'text-cyan-400', label: 'Water' },
        { type: 'pillar' as ObstacleType, icon: Columns2, color: 'text-emerald-400', label: 'Pillar' },
        { type: 'heat' as ObstacleType, icon: Heater, color: 'text-red-400', label: 'Heat' },
        { type: 'zone' as ObstacleType, icon: ShieldAlert, color: 'text-purple-400', label: 'Zone' },
    ];

    const handleInject = (type: ObstacleType) => {
        // 1. Inject the new obstacle
        dispatch(addObstacle({ wallIndex, type }));

        // 2. The new obstacle will be at the end of the array
        // We set a small timeout to ensure the state has updated before selecting
        setTimeout(() => {
            dispatch(setSelectedObstacle(obstacles.length));
        }, 50);
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-black/60 backdrop-blur-2xl rounded-[1.5rem] border border-white/10 shadow-2xl">
            <div className="flex flex-col px-3 border-r border-white/10 mr-2">
                <span className="text-[7px] font-black text-magic-purple uppercase tracking-[0.3em]">Hardware</span>
                <span className="text-[9px] font-bold text-white/40 uppercase font-mono">Inject_v4</span>
            </div>

            <div className="flex items-center gap-2">
                {tools.map((tool) => (
                    <button
                        key={tool.type}
                        onClick={() => handleInject(tool.type)}
                        className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5
                                 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300
                                 active:scale-90 cursor-pointer"
                    >
                        <span className={`${tool.color} transition-all duration-500 group-hover:scale-125 group-hover:rotate-[12deg]`}>
                            <tool.icon size={14} />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                            {tool.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}