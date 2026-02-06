import React from 'react';

export default function UplinkSpinner() {
    return (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-2 border-magic-cyan border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
            <p className="text-[10px] font-mono text-magic-cyan uppercase animate-pulse tracking-[0.4em]">
                Establishing_Uplink...
            </p>
        </div>
    );
}