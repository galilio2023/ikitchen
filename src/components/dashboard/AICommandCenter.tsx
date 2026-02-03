'use client';

import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/lib/hooks';
import { addObstacle } from '@/lib/features/kitchens/kitchenSlice';
import { v4 as uuidv4 } from 'uuid';

export function AICommandCenter() {
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
                // If the AI returns units, we dispatch them to the store
                if (data.units && Array.isArray(data.units)) {
                    data.units.forEach((unit: any) => {
                        dispatch(addObstacle({
                            id: unit.id || uuidv4(),
                            type: unit.type,
                            wallIndex: 0,
                            position: {
                                x: unit.position?.x || unit.x || 0,
                                y: unit.position?.y || unit.y || 0,
                                z: unit.position?.z || 0,
                                width: unit.position?.width || 60,
                                height: unit.position?.height || 60,
                                depth: unit.position?.depth || 60,
                            }
                        }));
                    });
                }
                setPrompt('');
            }
        } catch (error) {
            console.error("AI_GENERATION_FAILURE", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 py-6 mt-6 bg-muted/20 border-t border-b border-border space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Neural_Core_AI</h3>
            </div>

            <form onSubmit={handleGenerate} className="relative">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="GENERATE_SPATIAL_NODE..."
                    className="w-full bg-background/40 border border-border rounded-xl p-3 text-[10px] font-mono tracking-widest text-foreground focus:outline-none focus:border-primary/40 transition-all resize-none h-24 scrollbar-hide"
                />
                <button 
                    disabled={loading || !prompt.trim()}
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
            </form>
            
            <p className="text-[7px] font-mono text-muted-foreground uppercase tracking-[0.2em] leading-relaxed">
                Enter architectural parameters to initiate automated node materialization.
            </p>
        </div>
    );
}
