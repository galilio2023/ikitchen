'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Image, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { applyDesign } from '@/lib/features/kitchens/kitchenSlice';
import{ toast } from 'sonner';

export default function AIDesignGenerator() {
    const dispatch = useAppDispatch();
    const { currentKitchen } = useAppSelector((state) => state.kitchen);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isVisualizingImage, setIsVisualizingImage] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [imageDescription, setImageDescription] = useState<string | null>(null);
    const [designRationale, setDesignRationale] = useState<string | null>(null);

    const generateCompleteDesign = async () => {
        if (!currentKitchen) {
            toast.error('No kitchen data available');
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);
        setImageDescription(null);
        setDesignRationale(null);

        try {
            // Step 1: Generate kitchen layout withAI
            toast.info('🤖 Gemini AI: Analyzing kitchen dimensions...');
            
            const designResponse = await fetch('/api/generate/design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kitchenData: currentKitchen }),
            });

            if(!designResponse.ok) {
                throw new Error('Failed to generate design');
            }

            const designData = await designResponse.json();
            
            if (designData.success && designData.design) {
                // Apply the generated design to Redux state
                dispatch(applyDesign({
                    obstacles: designData.design.obstacles|| [],
                    appliances: designData.design.appliances || []
                }));
                
                setDesignRationale(designData.aiRationale || 'Design optimized for ergonomics');
                
                toast.success('✅ Kitchen layout generated successfully!');
                
                // Step 2: Generate visualization image
                await generateVisualization(designData.design);
            }
        } catch (error) {
            console.error('[AI DESIGN] Error:', error);
            toast.error('Failed to generate design. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateVisualization = async (design: { appliances: unknown[]; obstacles:unknown[] }) => {
        setIsVisualizingImage(true);
        
        try {
            toast.info('🎨 Generating kitchen visualization...');
            
            const imageResponse = await fetch('/api/generate/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({kitchenData: {
                        ...currentKitchen,
                        appliances: design.appliances,
                        obstacles: [...(currentKitchen?.obstacles || []), ...design.obstacles]
                    }
                }),
            });

            if (!imageResponse.ok) {
                throw new Error('Failed to generate visualization');
            }

            const imageData= await imageResponse.json();
            
            if (imageData.success) {
                setGeneratedImage(imageData.imageUrl);
                setImageDescription(imageData.description);
                toast.success('✅ Kitchen visualization ready!');
            }
        } catch (error) {
            console.error('[AI VISUALIZATION] Error:', error);
            toast.error('Failed to generate visualization');
        } finally {
            setIsVisualizingImage(false);
        }
    };

    if (!currentKitchen) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Generate Button */}
            <button
                onClick={generateCompleteDesign}
                disabled={isGenerating || isVisualizingImage}
                className="w-full py-4 px-6 bg-gradient-to-r from-magic-purple to-magic-cyan rounded-2xl text-primary-foreground font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
               {isGenerating || isVisualizingImage ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        {isGenerating ? 'Generating Design...' : 'Creating Visualization...'}
                    </>
                ) : (
                    <>
                        <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
                        Generate Complete Design
                    </>
                )}
            </button>

            {/* Design Rationale */}
            {designRationale && (
                <div className="glass-brilliant p-4 rounded-xl border border-border space-y-2 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 size={16} />
                        <h4 className="text-xs font-black uppercase tracking-wider">AI Design Rationale</h4>
                    </div>
                    <p className="text-xstext-muted-foreground leading-relaxed">
                        {designRationale}
                    </p>
                </div>
            )}

            {/* Generated Image Preview */}
            {generatedImage && (
                <div className="glass-brilliant p-4 rounded-xl border border-border space-y-3 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 text-magic-cyan">
                        <Image size={16} />
                        <h4 className="text-xs font-black uppercase tracking-wider">Kitchen Visualization</h4>
                    </div>
                    
                    <div className="relative aspect-video rounded-lgoverflow-hidden border border-border">
                        <img 
                            src={generatedImage} 
                            alt="Generated Kitchen Design"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {imageDescription && (
                        <div className="space-y-2">
                            <h5 className="text-[10px] font-black uppercase tracking-wider text-foreground/60">
                                Description
                            </h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {imageDescription}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Info Box */}
            {!isGenerating && !generatedImage && (
                <div className="glass-brilliant p-4 rounded-xl border border-border/50 space-y-2">
                    <div className="flex items-center gap-2 text-magic-purple">
                        <AlertCircle size={14} />
                        <h4 className="text-[10px] font-black uppercase tracking-wider">AI-Powered Design</h4>
                    </div>
                    <p className="text-[10px]text-muted-foreground leading-relaxed">
                        Gemini AI will analyze your kitchen dimensions, existing obstacles (windows, doors, vents), 
                        and generate a complete layout with optimal appliance placement and a visual preview.
                    </p>
                </div>
            )}
        </div>
    );
}
