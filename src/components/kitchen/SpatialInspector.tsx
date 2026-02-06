"use client";

import React from "react";
import { Maximize2, Move, Box, Trash2 } from "lucide-react";
import { useKitchenStore } from '@/providers/KitchenStoreProvider'; // CORRECTED IMPORT PATH

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 border-b pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Box size={16} className="text-primary" />
          <span className="text-sm font-bold uppercase">{selectedNode.type}</span>
        </div>
        <button onClick={handleDelete} className="btn btn-destructive btn-sm p-2">
          <Trash2 size={16} />
        </button>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-muted-foreground">Position (cm)</h3>
        <div className="grid grid-cols-2 gap-3">
          <CoordinateBox
            label="X"
            value={selectedNode.position.x}
            onChange={(v) => updateObstacleDetails(selectedNode.id, { x: v })}
          />
          <CoordinateBox
            label="Y"
            value={selectedNode.position.y}
            onChange={(v) => updateObstacleDetails(selectedNode.id, { y: v })}
          />
        </div>
      </section>

      <section className="space-y-4 mt-6">
        <h3 className="text-xs font-bold uppercase text-muted-foreground">Dimensions (cm)</h3>
        <div className="space-y-2">
          <DimensionRow
            label="Width"
            value={selectedNode.position.width}
            onChange={(v) => updateObstacleDetails(selectedNode.id, { width: v })}
          />
          <DimensionRow
            label="Height"
            value={selectedNode.position.height}
            onChange={(v) => updateObstacleDetails(selectedNode.id, { height: v })}
          />
        </div>
      </section>
    </div>
  );
}

// --- Helper Components ---

interface InspectorFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

function CoordinateBox({ label, value, onChange }: InspectorFieldProps) {
  return (
    <div className="bg-muted p-3 rounded-lg border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-transparent text-sm font-mono focus:outline-none"
      />
    </div>
  );
}

function DimensionRow({ label, value, onChange }: InspectorFieldProps) {
  return (
    <div className="bg-muted p-4 rounded-lg border flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{label}</p>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 bg-transparent text-sm font-mono text-right focus:outline-none"
      />
    </div>
  );
}
