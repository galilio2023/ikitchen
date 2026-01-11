'use client';

import { IWall } from '@/types';

export default function WallNavigator({ walls }: { walls: IWall[] }) {
    const scrollToWall = (index: number) => {
        const element = document.getElementById(`wall-panel-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="sticky top-4 z-30 flex justify-center w-full pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-1 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                {walls.map((wall, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToWall(index)}
                        className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all
                                 text-white/40 hover:text-magic-purple hover:bg-magic-purple/10 border border-transparent hover:border-magic-purple/20"
                    >
                        {wall.label}
                    </button>
                ))}
            </div>
        </div>
    );
}