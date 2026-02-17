"use client";

import React from "react";
import { Box, Trash2, ArrowLeftRight, ArrowUpDown, MoveHorizontal, MoveVertical, Plus, Minus } from "lucide-react";
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { cn } from "@/lib/utils";

interface RenderableNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface SpatialInspectorProps {
  selectedNode: RenderableNode;
}

export default function SpatialInspector({ selectedNode }: SpatialInspectorProps) {
  const { updateObstacleDetails, deleteObstacle, setSelectedObstacle } = useKitchenStore(state => state);

  const handleDelete = () => {
    deleteObstacle(selectedNode.id);
    setSelectedObstacle(null);
  };

  const handleUpdate = (updates: Partial<{ x: number; y: number; width: number; height: number }>) => {
    // Basic validation: prevent negative or tiny dimensions
    if (updates.width !== undefined && updates.width < 10) updates.width = 10;
    if (updates.height !== undefined && updates.height < 10) updates.height = 10;
    if (updates.x !== undefined && updates.x < 0) updates.x = 0;
    if (updates.y !== undefined && updates.y < 0) updates.y = 0;

    updateObstacleDetails(selectedNode.id, updates);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="flex items-center justify-between gap-2 border-b pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-md">
            <Box size={18} className="text-primary" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-muted-foreground block leading-none mb-1">Selected Item</span>
            <span className="text-sm font-bold uppercase tracking-tight">{selectedNode.type}</span>
          </div>
        </div>
        <button 
          onClick={handleDelete} 
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          title="Delete Item"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Position (cm)</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InspectorField
              label="X Offset"
              icon={<MoveHorizontal size={14} />}
              value={selectedNode.position.x}
              onChange={(v) => handleUpdate({ x: v })}
            />
            <InspectorField
              label="Y Offset"
              icon={<MoveVertical size={14} />}
              value={selectedNode.position.y}
              onChange={(v) => handleUpdate({ y: v })}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Dimensions (cm)</h3>
          </div>
          <div className="space-y-3">
            <InspectorField
              label="Width"
              icon={<ArrowLeftRight size={14} />}
              value={selectedNode.position.width}
              onChange={(v) => handleUpdate({ width: v })}
              fullWidth
            />
            <InspectorField
              label="Height"
              icon={<ArrowUpDown size={14} />}
              value={selectedNode.position.height}
              onChange={(v) => handleUpdate({ height: v })}
              fullWidth
            />
          </div>
        </section>
      </div>

      <div className="mt-auto pt-6 border-t">
        <p className="text-[10px] text-muted-foreground italic">
          Tip: Use the input fields for precise adjustments. Dimensions are constrained to a minimum of 10cm.
        </p>
      </div>
    </div>
  );
}

// --- Helper Components ---

interface InspectorFieldProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  fullWidth?: boolean;
}

function InspectorField({ label, icon, value, onChange, fullWidth }: InspectorFieldProps) {
  const step = 5;

  return (
    <div className={cn("bg-muted/50 p-3 rounded-xl border border-border/50 transition-all focus-within:border-primary/50 focus-within:bg-muted", fullWidth && "w-full")}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-foreground">{icon}</span>
        <p className="text-[10px] font-bold uppercase text-muted-foreground/80">{label}</p>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <button 
          onClick={() => onChange(value - step)}
          className="p-1 hover:bg-background rounded-md text-muted-foreground transition-colors"
        >
          <Minus size={14} />
        </button>
        
        <input
          type="number"
          value={Math.round(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-sm font-mono text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button 
          onClick={() => onChange(value + step)}
          className="p-1 hover:bg-background rounded-md text-muted-foreground transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
