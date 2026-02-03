"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  ImageIcon, // Fixed: Standard import
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { applyDesign } from "@/lib/features/kitchens/kitchenSlice";
import { toast } from "sonner";

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
      toast.error("No kitchen data available");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setImageDescription(null);
    setDesignRationale(null);

    try {
      toast.info("🤖 Gemini AI: Analyzing kitchen dimensions...");

      const designResponse = await fetch("/api/generate/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitchenId: currentKitchen.id || currentKitchen._id,
        }), // Fixed: Send ID, not full object
      });

      if (!designResponse.ok) throw new Error("Failed to generate design");

      const designData = await designResponse.json();

      if (designData.success && designData.design) {
        dispatch(
          applyDesign({
            obstacles: designData.design.obstacles || [],
            appliances: designData.design.appliances || [],
          }),
        );

        setDesignRationale(
          designData.design.aiReasoning || "Design optimized for ergonomics",
        );
        toast.success("✅ Kitchen layout generated successfully!");
        await generateVisualization(designData.design);
      }
    } catch (error) {
      console.error("[AI DESIGN] Error:", error);
      toast.error("Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVisualization = async (design: any) => {
    setIsVisualizingImage(true);
    try {
      toast.info("🎨 Generating kitchen visualization...");
      const imageResponse = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitchenId: currentKitchen?.id || currentKitchen?._id,
        }),
      });

      if (!imageResponse.ok)
        throw new Error("Failed to generate visualization");

      const imageData = await imageResponse.json();
      if (imageData.success) {
        setGeneratedImage(imageData.imageUrl);
        setImageDescription(imageData.description);
        toast.success("✅ Kitchen visualization ready!");
      }
    } catch (error) {
      console.error("[AI VISUALIZATION] Error:", error);
    } finally {
      setIsVisualizingImage(false);
    }
  };

  if (!currentKitchen) return null;

  return (
    <div className="space-y-4">
      <button
        onClick={generateCompleteDesign}
        disabled={isGenerating || isVisualizingImage}
        className="w-full py-4 px-6 bg-linear-to-r from-indigo-600 to-cyan-500 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
      >
        {isGenerating || isVisualizingImage ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            {isGenerating
              ? "Generating Design..."
              : "Creating Visualization..."}
          </>
        ) : (
          <>
            <Sparkles
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            Generate Complete Design
          </>
        )}
      </button>

      {designRationale && (
        <div className="glass-brilliant p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 size={16} />
            <h4 className="text-xs font-black uppercase tracking-wider">
              AI Design Rationale
            </h4>
          </div>
          {/* FIXED SPACE BELOW */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
            {designRationale}
          </p>
        </div>
      )}

      {generatedImage && (
        <div className="glass-brilliant p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 text-cyan-500">
            <ImageIcon size={16} />
            <h4 className="text-xs font-black uppercase tracking-wider">
              Kitchen Visualization
            </h4>
          </div>
          {/* FIXED SPACE BELOW IN className */}
          <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <img
              src={generatedImage}
              alt="Design Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
          {imageDescription && (
            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                Description
              </h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {imageDescription}
              </p>
            </div>
          )}
        </div>
      )}

      {!isGenerating && !generatedImage && (
        <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-2 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 text-indigo-500">
            <AlertCircle size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-wider">
              AI-Powered Design
            </h4>
          </div>
          {/* FIXED SPACE BELOW */}
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Gemini AI will analyze your kitchen dimensions and obstacles to
            generate an ergonomic layout and a 3D visual preview.
          </p>
        </div>
      )}
    </div>
  );
}
