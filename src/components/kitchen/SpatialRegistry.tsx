'use client';

import { IObstacle } from "@/types/kitchen";
import { Package, Hash, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpatialRegistryProps {
    nodes: any[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export default function SpatialRegistry({ nodes, selectedId, onSelect }: SpatialRegistryProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-1">
                <h3 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Node_Registry</h3>
                <p className="text-[7px] lg:text-[8px] font-mono text-foreground/10 uppercase tracking-widest">Active_Spatial_Units: {nodes.length}</p>
            </div>

            <div className="space-y-2">
                {nodes.map((node) => (
                    <button
                        key={node.renderKey}
                        onClick={() => onSelect(node.id)}
                        className={cn(
                            "w-full glass-brilliant p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center gap-2 lg:gap-3 border transition-all duration-300 group text-left",
                            selectedId === node.id
                                ? "border-magic-cyan bg-magic-cyan/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                                : "border-border hover:border-foreground/20 hover:bg-accent/20"
                        )}
                    >
                        <div className={cn(
                            "p-1.5 lg:p-2 rounded-lg lg:rounded-xl border transition-colors",
                            selectedId === node.id ? "bg-magic-cyan/20 border-magic-cyan/40 text-magic-cyan" : "bg-accent/30 border-border text-foreground/20 group-hover:text-foreground/40"
                        )}>
                            <Package size={14} />
                        </div>
                        <div className="overflow-hidden">
                            <p className={cn(
                                "text-[8px] lg:text-[9px] font-black uppercase tracking-widest truncate",
                                selectedId === node.id ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/60"
                            )}>
                                {node.type || node.name}_NODE
                            </p>
                            <p className="text-[6px] lg:text-[7px] font-mono text-foreground/20 uppercase tracking-tighter mt-0.5">
                                ID: {node.id?.slice(-8) || 'SYSTEM'}
                            </p>
                        </div>
                    </button>
                ))}

                {(nodes?.length ?? 0) === 0 && (
                    <div className="py-10 text-center space-y-3">
                        <div className="inline-flex p-3 rounded-full bg-accent/20 border border-border text-foreground/10">
                            <Layers size={20} />
                        </div>
                        <p className="text-[8px] font-mono text-foreground/20 uppercase tracking-widest">Workspace_Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
}
