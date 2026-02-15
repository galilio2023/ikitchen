'use client';

import React, { useState, useTransition } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, Box } from 'lucide-react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { generateAiImage } from '@/actions/aiActions';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box as ThreeBox, Grid, Environment, ContactShadows } from '@react-three/drei';

export default function VisualizationPanel() {
    const [mode, setMode] = useState<'2d' | '3d'>('2d');
    const { currentKitchen } = useKitchenStore(state => state);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleVisualize = () => {
        if (!currentKitchen) {
            setError("No kitchen data available to visualize.");
            return;
        }
        setError(null);
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

    const render3DScene = () => {
        if (!currentKitchen) return null;

        const allItems = [
            ...(currentKitchen.obstacles || []).map(o => ({ ...o, isAppliance: false })),
            ...(currentKitchen.appliances || []).map(a => ({ ...a, isAppliance: true }))
        ];
        const wall = currentKitchen.walls[0]; // Simple visualization for the first wall for now

        return (
            <div className="h-64 w-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden border border-border mt-4 relative shadow-inner">
                <Canvas camera={{ position: [0, 200, 400], fov: 45 }} shadows>
                    {/* Lighting & Environment */}
                    <Environment preset="apartment" />
                    <ambientLight intensity={0.4} />
                    <directionalLight 
                        position={[100, 200, 100]} 
                        intensity={1} 
                        castShadow 
                        shadow-mapSize={[1024, 1024]} 
                    />
                    
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
                    
                    {/* Floor Grid - Subtle */}
                    <Grid 
                        infiniteGrid 
                        fadeDistance={600} 
                        sectionColor="#a0a0a0" 
                        cellColor="#d0d0d0" 
                        position={[0, -1, 0]}
                    />

                    {/* Ground Shadows */}
                    <ContactShadows resolution={1024} scale={500} blur={2} opacity={0.5} far={10} color="#000000" />

                    {/* Wall Floor Representation */}
                    {wall && (
                        <ThreeBox 
                            args={[wall.length, 2, 20]} 
                            position={[wall.length / 2, 0, 0]}
                            receiveShadow
                        >
                            <meshStandardMaterial color="#e5e7eb" roughness={0.8} />
                        </ThreeBox>
                    )}

                    {/* Items */}
                    {allItems.map((item, idx) => (
                        <ThreeBox
                            key={item.id || idx}
                            args={[item.position.width, item.position.height, item.position.depth]}
                            position={[
                                item.position.x + item.position.width / 2,
                                item.position.y + item.position.height / 2,
                                item.position.depth / 2 // Extrude outwards
                            ]}
                            castShadow
                            receiveShadow
                        >
                            <meshStandardMaterial 
                                color={item.isAppliance ? "#3b82f6" : "#ef4444"} 
                                roughness={0.2} // Glossy for appliances
                                metalness={item.isAppliance ? 0.5 : 0.1}
                            />
                        </ThreeBox>
                    ))}
                </Canvas>
                <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground pointer-events-none select-none bg-background/80 backdrop-blur px-2 py-1 rounded border shadow-sm">
                    Left Click: Rotate | Right Click: Pan | Scroll: Zoom
                </div>
            </div>
        );
    };

    return (
        <div className="card p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <Box size={22} className="text-primary" />
                    Visualization
                </h2>
                <div className="flex bg-muted rounded-lg p-1">
                    <button 
                        onClick={() => setMode('2d')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${mode === '2d' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        AI Render
                    </button>
                    <button 
                        onClick={() => setMode('3d')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${mode === '3d' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        3D Preview
                    </button>
                </div>
            </div>

            {mode === '2d' ? (
                <>
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
                                    Generate AI Concept
                                </div>
                            )}
                        </button>
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            Generates a photorealistic concept of your layout.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground p-4 rounded-lg mb-4">
                            <h3 className="font-bold">Visualization Failed</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {imageUrl && (
                        <div className="rounded-lg overflow-hidden border">
                            <img src={imageUrl} alt="AI Generated Kitchen" className="w-full h-auto" />
                        </div>
                    )}
                </>
            ) : (
                render3DScene()
            )}
        </div>
    );
}
