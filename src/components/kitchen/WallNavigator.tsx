'use client';

import { IWall } from '@/types/kitchen';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setActiveWallIndex } from '@/lib/features/kitchens/kitchenSlice';
import { cn } from "@/lib/utils";

export default function WallNavigator() {
    const dispatch = useAppDispatch();
    const { currentKitchen, activeWallIndex } = useAppSelector((state) => state.kitchen);

    if (!currentKitchen || currentKitchen.walls.length <= 1) return null;

    return (
        /* Adjusted positioning: stays at top for mobile, floating for desktop */
        <div className="absolute top-20 lg:top-8 left-1/2 -translate-x-1/2 z-[35] w-max max-w-[90vw] overflow-x-auto no-scrollbar pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-1 p-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                {currentKitchen.walls.map((wall, index) => (
                    <button
                        key={wall.id || index}
                        onClick={() => dispatch(setActiveWallIndex(index))}
                        className={cn(
                            "px-4 lg:px-6 py-1.5 lg:py-2 rounded-full text-[8px] lg:text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap",
                            activeWallIndex === index
                                ? "bg-magic-cyan text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {wall.label}
                    </button>
                ))}
            </div>
        </div>
    );
}