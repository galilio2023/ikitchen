'use client';

import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider'; // CORRECTED IMPORT PATH

export default function VisualizationPanel() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { currentKitchen } = useKitchenStore(state => state);

    const handleVisualize = async () => {
        if (!currentKitchen) {
            setError("No kitchen data available to visualize.");
            return;
        }

        setLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const prompt = `A photorealistic image of a modern kitchen. 
                Layout: ${currentKitchen.appliances.length > 2 ? 'Complex' : 'Simple'}. 
                Walls: ${currentKitchen.walls.map(w => `${w.length}x${w.height}cm`).join(', ')}. 
                Features: ${currentKitchen.appliances.map(a => a.type).join(', ')}.`;

            // This will be replaced with a Server Action
            const response = await fetch('/api/generate/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kitchenData: currentKitchen, prompt }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to generate image.");
            }

            const data = await response.json();
            setImageUrl(data.imageUrl);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                    disabled={loading}
                    className="btn btn-primary w-full h-12 text-sm"
                >
                    {loading ? (
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

            {error && !loading && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground p-4 rounded-lg mb-4 flex items-start gap-3">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <div>
                        <h3 className="font-bold">Visualization Failed</h3>
                        <p className="text-sm">{error}</p>
                    </div>
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
