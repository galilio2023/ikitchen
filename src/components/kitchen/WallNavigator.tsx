"use client";

import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { cn } from "@/lib/utils";

export default function WallNavigator() {
  const { currentKitchen, activeWallIndex, setActiveWallIndex } = useKitchenStore(state => state);

  if (!currentKitchen || !currentKitchen.walls || currentKitchen.walls.length <= 1) {
    return null;
  }

  return (
    <div className="absolute top-20 lg:top-8 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-1 p-1 bg-card/80 backdrop-blur-md border rounded-full shadow-lg">
        {currentKitchen.walls.map((wall, index) => (
          <button
            key={wall.id || index}
            onClick={() => setActiveWallIndex(index)}
            className={cn(
              "px-6 py-2 rounded-full text-xs font-bold uppercase transition-colors",
              activeWallIndex === index
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            {wall.label}
          </button>
        ))}
      </div>
    </div>
  );
}
