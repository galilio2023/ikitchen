'use client';

import { Database } from "lucide-react";

interface EmptyDashboardProps {
    error?: string | null;
}

export default function EmptyDashboard({ error }: EmptyDashboardProps) {
    const handleSeed = async () => {
        try {
            await fetch('/api/projects');
            window.location.reload();
        } catch (err) {
            console.error("SEED_FAILURE", err);
        }
    };

    return (
        <div className="h-64 flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-4 flex flex-col items-center">
                <div className="p-4 rounded-full bg-accent/20 border border-border text-foreground/10">
                    <Database size={32} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-foreground font-black uppercase tracking-tighter">No Active Nodes Found</h3>
                    <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-widest">
                        {error ? `SYSTEM_SYNC_ERROR: ${error}` : "No nodes established in cluster."}
                    </p>
                </div>
            </div>

            <button 
                onClick={handleSeed}
                className="px-8 py-3 rounded-2xl bg-magic-cyan/10 border border-magic-cyan/20 text-magic-cyan text-[10px] font-black uppercase tracking-widest hover:bg-magic-cyan/20 transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            >
                Seed_Database
            </button>
        </div>
    );
}
