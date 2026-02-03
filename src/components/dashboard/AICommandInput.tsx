'use client';

import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/lib/hooks';
import { addObstacle } from '@/lib/features/kitchens/kitchenSlice';

export function AICommandInput() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/generate/kitchen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.units && Array.isArray(data.units)) {
data.units.forEach((unit: any) => {
                        dispatch(addObstacle({
                            type: unit.type,
                            wallIndex: 0,
                            x: unit.x,
                            y: unit.y
                        }));
                    });
                }
                setPrompt('');
            }
        } catch (error) {
            // Error handledby AI core
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 py-6 mt-6 bg-accent/5 border-t border-b border-border space-y-4 backdrop-blur-xl group transition-all hover:border-primary/40">
            <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-magic-cyan animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60">Neural_AI_Core</h3>
            </div>

            <form onSubmit={handleGenerate} className="relative">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                   placeholder="INITIATE_SPATIAL_SYNC..."
                    className="w-full h-20 p-3 rounded-xl text-[10px] font-mono tracking-widest text-foreground placeholder:text-muted-foreground bg-accent/20 border border-border focus:outline-none focus:ring-2 focus:ring-magic-cyan transition-all resize-none scrollbar-hide"
                />
                <button 
                    disabled={loading || !prompt.trim()}
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-magic-cyan/20 border border-magic-cyan/40 text-magic-cyan hover:bg-magic-cyan hover:text-primary-foreground transition-all disabled:opacity-50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                >
                   {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
            </form>
            
            <p className="text-[7px] font-mono text-foreground/20 uppercase tracking-[0.2em] leading-relaxedgroup-hover:text-primary/40 transition-colors">
                Titan_Protocol: Automated node materialization via natural language uplink.
            </p>
        </div>
    );
}
