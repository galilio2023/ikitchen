'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchKitchenById } from '@/lib/features/kitchens/kitchenSlice';
import ElevationEngine from '@/components/kitchen/ElevationEngine';
import SpatialEditor from '@/components/kitchen/SpatialEditor';

export default function ProjectEditorPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();

    // Pulling both data and loading state
    const { currentKitchen, loading, error } = useAppSelector((state) => state.kitchen);

    useEffect(() => {
        if (id) {
            dispatch(fetchKitchenById(id as string));
        }
    }, [id, dispatch]);

    // 1. Loading State (Full Viewport)
    if (loading) return (
        <div className="flex h-[calc(100vh-6rem)] items-center justify-center bg-obsidian">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-magic-purple/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-magic-purple border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-1 text-center">
                    <p className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">
                        Synchronizing_Neural_Link
                    </p>
                    <p className="text-white/10 font-mono text-[8px] uppercase">Establishing_Secure_Uplink...</p>
                </div>
            </div>
        </div>
    );

    // 2. Error State
    if (error || !currentKitchen) return (
        <div className="flex h-[calc(100vh-6rem)] items-center justify-center bg-obsidian text-red-500 font-mono text-[10px] tracking-widest p-10 text-center">
            <div className="border border-red-500/20 bg-red-500/5 p-8 rounded-3xl">
                ERROR_CODE: {error || "404_PROJECT_NOT_FOUND"}
                <p className="text-white/20 mt-2 text-[8px]">Please verify project ID and database status.</p>
            </div>
        </div>
    );

    return (
        /**
         * MAIN EDITOR VIEWPORT
         * h-[calc(100vh-6rem)] is the master height.
         */
        <div className="flex h-[calc(100vh-6rem)] overflow-hidden bg-obsidian text-white border-t border-white/5">

            {/* Left Wing: 2D Spatial Logic */}
            <section className="w-1/2 border-r border-white/5 relative bg-black/10">
                <div className="absolute top-4 left-6 z-20">
                    <span className="text-[8px] font-black text-magic-purple uppercase tracking-widest bg-black/50 px-2 py-1 rounded border border-white/5 backdrop-blur-md">
                        Plan_View_2D
                    </span>
                </div>
                {/* Ensure SpatialEditor uses h-full internally */}
                <SpatialEditor />
            </section>

            {/* Right Wing: Elevation Engine */}
            <section className="w-1/2 relative flex flex-col h-full overflow-hidden bg-[#030303]">
                <div className="absolute top-4 left-6 z-20">
                    <span className="text-[8px] font-black text-magic-cyan uppercase tracking-widest bg-black/50 px-2 py-1 rounded border border-white/5 backdrop-blur-md">
                        Elevation_Render_3D
                    </span>
                </div>
                {/* ElevationEngine will now handle its own internal scrolling */}
                <ElevationEngine kitchen={currentKitchen} />
            </section>
        </div>
    );
}