"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useKitchenStore } from "@/providers/KitchenStoreProvider";
import { selectRenderableNodes } from "@/lib/store/kitchenStore";
import { v4 as uuidv4 } from "uuid";
import { updateKitchen } from "@/actions/projectActions";
import { toast } from "sonner";
import { DEFAULT_OBSTACLE_DIMENSIONS } from "@/lib/constants";
import { ObstacleType } from "@/types/kitchen";

import SpatialCanvas from "@/components/kitchen/SpatialCanvas";
import UnifiedSidebar from "@/components/kitchen/UnifiedSidebar";
import { Save, Loader2 } from "lucide-react";

export default function KitchenEditor() {
  const store = useKitchenStore((state) => state);
  const renderableNodes = useKitchenStore(selectRenderableNodes);
  const [isSaving, startSaveTransition] = useTransition();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleSave = () => {
    const kitchenToSave = store.currentKitchen;
    if (kitchenToSave) {
      startSaveTransition(async () => {
        const result = await updateKitchen(kitchenToSave.id, kitchenToSave);
        if (result.success) {
          toast.success("Project Saved!");
        } else {
          toast.error(result.error);
        }
      });
    }
  };

  const currentWall = useMemo(() => {
    if (!store.currentKitchen || !store.currentKitchen.walls) return null;
    return store.currentKitchen.walls[store.activeWallIndex] || null;
  }, [store.currentKitchen, store.activeWallIndex]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const obstacleType = e.dataTransfer.getData("obstacleType") as ObstacleType;

    if (!obstacleType) return;

    const canvasRect = e.currentTarget.getBoundingClientRect();

    // Calculate scale factor (same logic as in SpatialCanvas)
    const padding = 40;
    const availableWidth = canvasRect.width - padding * 2;
    const wallWidth = currentWall?.length || 300;
    const scale = Math.min(availableWidth / wallWidth, 1.5);

    // Adjust coordinates based on scale and centering
    // This is a simplified calculation; a robust solution would share the coordinate transform logic
    const x = (e.clientX - canvasRect.left) / scale;
    const y = (e.clientY - canvasRect.top) / scale;

    const dimensions = DEFAULT_OBSTACLE_DIMENSIONS[obstacleType] || {
      width: 60,
      height: 60,
      depth: 30,
    };

    store.addObstacle({
      id: uuidv4(),
      type: obstacleType,
      wallIndex: store.activeWallIndex,
      position: {
        x: x - dimensions.width / 2, // Center on cursor
        y: y - dimensions.height / 2,
        z: 0,
        ...dimensions,
      },
    });
  };

  if (!store.currentKitchen) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-medium">Loading Editor...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex lg:flex-row gap-0 min-h-0 overflow-hidden relative">
      {/* Saving Indicator Overlay */}
      {isSaving && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-card border shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <Loader2 className="animate-spin text-primary" size={16} />
            <span className="text-sm font-medium">Saving changes...</span>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary gap-2"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      <main className="flex-1 relative min-w-0 h-full">
        <SpatialCanvas
          currentKitchen={store.currentKitchen}
          currentWall={currentWall}
          renderableObstacles={renderableNodes}
          selectedObstacleId={store.selectedObstacleId}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onCanvasClick={() => store.setSelectedObstacle(null)}
          onNodeClick={(id) => store.setSelectedObstacle(id)}
          onNodeDragStart={(id) => setDraggingId(id)}
        />
      </main>
      <UnifiedSidebar />
    </div>
  );
}
