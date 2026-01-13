// src/components/kitchen/PropertiesPanel.tsx
'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateObstacleDetails, setSelectedObstacle } from '@/lib/features/kitchens/kitchenSlice';
import { X, Ruler, MoveHorizontal, MoveVertical, Maximize } from 'lucide-react';

export default function PropertiesPanel() {
    const dispatch = useAppDispatch();
    const { currentKitchen, selectedObstacleId } = useAppSelector((state) => state.kitchen);

    const obsIndex = currentKitchen?.obstacles.findIndex(o => o.id === selectedObstacleId);
    if (obsIndex === undefined || obsIndex === -1 || !currentKitchen) return null;

    const obstacle = currentKitchen.obstacles[obsIndex];
    const { x, y, width, height } = obstacle.position;

    const updateValue = (key: string, val: string) => {
        dispatch(updateObstacleDetails({
            id: selectedObstacleId!,
            updates: { [key]: parseFloat(val) || 0 }
        }));
    };

    return (
        <div className="fixed right-84 top-1/2 -translate-y-1/2 w-64 bg-black/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-6 z-[100] shadow-3xl animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center mb-6">
                <span className="text-[9px] font-black text-magic-purple uppercase tracking-widest">Properties</span>
                <button onClick={() => dispatch(setSelectedObstacle(null))}>
                    <X size={14} className="text-white/20 hover:text-white" />
                </button>
            </div>

            <div className="space-y-4">
                <PropertyInput label="X_Position" icon={<MoveHorizontal size={12}/>} value={x} onChange={(v) => updateValue('x', v)} />
                <PropertyInput label="Y_Position" icon={<MoveVertical size={12}/>} value={y} onChange={(v) => updateValue('y', v)} />
                <div className="h-px bg-white/5 my-2" />
                <PropertyInput label="Width" icon={<Maximize size={12}/>} value={width} onChange={(v) => updateValue('width', v)} />
                <PropertyInput label="Height" icon={<Ruler size={12}/>} value={height} onChange={(v) => updateValue('height', v)} />
            </div>
        </div>
    );
}

function PropertyInput({ label, icon, value, onChange }: { label: string; icon: any; value: number; onChange: (v: string) => void }) {
    return (
        <div className="space-y-1 group">
            <div className="flex items-center gap-2 text-[8px] font-bold text-white/30 uppercase group-focus-within:text-magic-purple transition-colors">
                {icon} {label}
            </div>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-magic-purple/50 transition-all"
            />
        </div>
    );
}