'use client';

import React, { useState, useTransition } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { generateAiImage } from '@/actions/aiActions';

export default function VisualizationPanel() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { currentKitchen } = useKitchenStore(state => state);

    const handleVisualize = () => {
        if (!currentKitchen) {
            setError("No kitchen data available to visualize.");
            return;
        }

        setError(null);
        setImageUrl(null);

        startTransition(async () => {
            const prompt = `A photorealistic image of a modern kitchen. 
                Layout: ${currentKitchen.appliances.length > 2 ? 'Complex' : 'Simple'}. 
                Walls: ${currentKitchen.walls.map(w => `${w.length}x${w.height}cm`).join(', ')}. 
                Features: ${currentKitchen.appliances.map(a => a.type).join(', ')}.`;
            
            const result = await generateAiImage(prompt, currentKitchen);

            if (result.success && result.imageUrl) {
                setImageUrl(result.imageUrl);
            } else {
                setError(result.error || "An unknown error occurred.");
            }
        });
    };

    return (
        <div className="card p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <ImageIcon size={22} className="text-primary" />
                AI Visualization
            </h2>

            <div className="mb-6">
                <button
                    onClick={handleVisualize}
                    disabled={isPending}
                    className="btn btn-primary w-full h-12 text-sm"
                >
                    {isPending ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                            Rendering Image...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles size={16} />
                            Visualize Kitchen
                        </div>
                    )}
                </button>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                    Generates a visual concept of your current layout.
                </p>
            </div>

            {error && !isPending && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground p-4 rounded-lg mb-4">
                    <h3 className="font-bold">Visualization Failed</h3>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {imageUrl && !error && (
                <div className="rounded-lg overflow-hidden border">
                    <img src={imageUrl} alt="AI Generated Kitchen" className="w-full h-auto" />
                </div>
            )}
        </div>
    );
}
