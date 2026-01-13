'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface SpatialControlsProps {
    isOffline: boolean;
}

export default function SpatialControls({ isOffline }: SpatialControlsProps) {
    if (!isOffline) return null;

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 pointer-events-auto">
            <ShieldAlert size={32} className="text-red-500 mb-4 animate-pulse" />
            <p className="text-red-500 font-mono text-[10px] tracking-[0.2em] uppercase">
                NEURAL_WORKSPACE_OFFLINE
            </p>
        </div>
    );
}
