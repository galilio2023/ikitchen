import { IObstacle, IWall } from '@/types/kitchen';

interface DraggableObstacleProps {
    obstacle: IObstacle;
    wall: IWall;
    isSelected: boolean;
    globalIndex: number;
    onSelect: () => void;
    onPositionChange: (x: number, y: number) => void;
}

export default function DraggableObstacle({
                                              obstacle,
                                              isSelected,
                                              globalIndex,
                                              onSelect,
                                              onPositionChange
                                          }: DraggableObstacleProps) {
    // Tailwind v4 dynamic classes
    const selectionStyles = isSelected
        ? "border-magic-purple shadow-[0_0_15px_rgba(139,92,246,0.5)] z-50 ring-2 ring-magic-purple/20"
        : "border-border hover:border-border/30 z-10";

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            className={`absolute cursor-move transition-all border-2 rounded-lg bg-background/80 backdrop-blur-md flex items-center justify-center ${selectionStyles}`}
            style={{
                left: `${obstacle.position.x}px`,
                top: `${obstacle.position.y}px`,
                width: `${obstacle.position.width}px`,
                height: `${obstacle.position.height}px`,
            }}
        >
            <div className="flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-foreground/40 uppercase tracking-tighter">
                    {obstacle.type.substring(0, 3)}_{globalIndex}
                </span>
                {isSelected && (
                    <div className="h-1 w-1 rounded-full bg-magic-purple animate-pulse" />
                )}
            </div>
        </div>
    );
}