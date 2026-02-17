'use client';

import React, { useState, useTransition } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, Box, Cuboid } from 'lucide-react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { generateAiImage } from '@/actions/aiActions';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box as ThreeBox, Grid, Environment, ContactShadows, SoftShadows } from '@react-three/drei';

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
        const wall = currentKitchen.walls[0];

        return (
            <div className="h-64 w-full bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black rounded-xl overflow-hidden border border-border mt-4 relative shadow-inner group">
                <Canvas camera={{ position: [0, 200, 400], fov: 45 }} shadows>
                    <SoftShadows size={10} samples={10} focus={0.5} />
                    
                    {/* Realistic Environment Lighting */}
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <directionalLight 
                        position={[50, 100, 50]} 
                        intensity={1.5} 
                        castShadow 
                        shadow-mapSize={[1024, 1024]} 
                        shadow-bias={-0.0001}
                    />
                    
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} enableDamping dampingFactor={0.05} />
                    
                    {/* Floor Grid */}
                    <Grid 
                        infiniteGrid 
                        fadeDistance={600} 
                        sectionColor="#a0a0a0" 
                        cellColor="#e0e0e0" 
                        position={[0, -1, 0]}
                        sectionThickness={1}
                        cellThickness={0.5}
                    />

                    <ContactShadows resolution={1024} scale={500} blur={2} opacity={0.4} far={10} color="#000000" />

                    {/* Wall Floor Representation */}
                    {wall && (
                        <ThreeBox 
                            args={[wall.length, 2, 20]} 
                            position={[wall.length / 2, 0, 0]}
                            receiveShadow
                        >
                            <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
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
                                item.position.depth / 2
                            ]}
                            castShadow
                            receiveShadow
                        >
                            <meshStandardMaterial 
                                color={item.isAppliance ? "#6366f1" : "#f59e0b"} // Indigo for appliances, Amber for obstacles
                                roughness={item.isAppliance ? 0.2 : 0.5} 
                                metalness={item.isAppliance ? 0.6 : 0.1}
                                envMapIntensity={1}
                            />
                        </ThreeBox>
                    ))}
                </Canvas>
                
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Interactive 3D
                </div>
                
                <div className="absolute bottom-3 left-3 right-3 flex justify-center pointer-events-none">
                    <div className="bg-background/80 backdrop-blur border shadow-sm px-3 py-1.5 rounded-full text-[10px] text-muted-foreground flex gap-3">
                        <span>Left Click: Rotate</span>
                        <span className="w-px h-3 bg-border" />
                        <span>Right Click: Pan</span>
                        <span className="w-px h-3 bg-border" />
                        <span>Scroll: Zoom</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="card p-6 mt-6 bg-card/50">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Cuboid size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold">Visualization</h2>
                        <p className="text-xs text-muted-foreground">Preview your design</p>
                    </div>
                </div>
                
                <div className="flex bg-muted p-1 rounded-lg">
                    <button 
                        onClick={() => setMode('2d')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === '2d' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        AI Render
                    </button>
                    <button 
                        onClick={() => setMode('3d')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === '3d' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        3D Preview
                    </button>
                </div>
            </div>

            {mode === '2d' ? (
                <div className="space-y-4">
                    <div className="relative group">
                        <button
                            onClick={handleVisualize}
                            disabled={isPending}
                            className="btn btn-primary w-full h-32 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin h-8 w-8" />
                                    <span className="text-sm font-medium">Rendering Concept...</span>
                                </>
                            ) : (
                                <>
                                    <div className="p-3 bg-background rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                        <Sparkles size={24} />
                                    </div>
                                    <span className="text-sm font-medium">Generate Photorealistic Concept</span>
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-xs">
                            {error}
                        </div>
                    )}

                    {imageUrl && (
                        <div className="rounded-xl overflow-hidden border shadow-md animate-in fade-in zoom-in-95 duration-300">
                            <img src={imageUrl} alt="AI Generated Kitchen" className="w-full h-auto hover:scale-105 transition-transform duration-700" />
                        </div>
                    )}
                </div>
            ) : (
                render3DScene()
            )}
        </div>
    );
}
