"use client";

import { useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { useKitchenStore } from '@/providers/KitchenStoreProvider';

import { toast } from "sonner";
import { IObstacle } from "@/types/kitchen";

interface PreviewObstacle extends IObstacle {
  _preview: boolean;
}

export default function AIDesignGenerator() {
  const currentKitchen = useKitchenStore(state => state.currentKitchen);
  const previewDesign = useKitchenStore(state => state.previewDesign); // Note: previewDesign may need to be added to the store
  const setPreviewDesign = useKitchenStore(state => state.setPreviewDesign); // This function may need to be added to the store
  const setPreviewObstacles = useKitchenStore(state => state.setPreviewObstacles); // This function may need to be added to the store
  const applyDesign = useKitchenStore(state => state.applyDesign); // This function may need to be added to the store

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);

  const generateCompleteDesign = async () => {
    if (!currentKitchen) {
      toast.error("No kitchen data available");
      return;
    }

    setIsGenerating(true);
    // Reset state
    setConflicts([]);

    try {
      toast.info("🤖 AI: Analyzing kitchen dimensions...");

      const response = await fetch("/api/generate/kitchen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitchenId: currentKitchen._id || currentKitchen.id,
          prompt: "Design a modern kitchen with efficient workflow",
          options: { generateImage: false },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          toast.error(
            "AI Output Validation Failed. Check console for details.",
          );
          console.error("Raw Ref:", data.rawResponseRef);
        } else {
          throw new Error(data.error || "Failed to generate");
        }
        return;
      }

      if (data.success && data.design) {
        setPreviewDesign(data.design);

        // Map units to preview obstacles with correct spatial mapping
        const previewObstacles: PreviewObstacle[] = data.design.units.map(
          (unit: any, index: number) => ({
            id: `preview-${index}`,
            type: unit.type,
            x: unit.position.x,
            y: unit.position.y,
            width: unit.position.width,
            height: unit.position.height,
            z: unit.position.depth || 0,
            wallIndex: unit.wallIndex,
            _preview: true,
          }),
        );

        setPreviewObstacles(previewObstacles);
        setConflicts(data.conflicts || []);

        setShowPreview(true);
        toast.success("✅ Layout generated!");
      }
    } catch (error: any) {
      toast.error(error.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptDesign = async (forceSave = false) => {
    try {
      const response = await fetch(
        `/api/kitchens/${currentKitchen?._id || currentKitchen?.id}/design`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            generatedDesign: previewDesign,
            applyUnitsAsObstacles: true,
            force: forceSave,
          }),
        },
      );

      const result = await response.json();

      if (response.status === 409) {
        setConflicts(result.conflicts);
        toast.warning(
          'Spatial conflicts detected. Click "Force Accept" to ignore.',
        );
        return;
      }

      if (result.success) {
        applyDesign({
          obstacles: result.obstacles,
          appliances: result.appliances,
        });
        setShowPreview(false);
        toast.success("Design permanently saved!");
      }
    } catch (error) {
      toast.error("Acceptance failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Generate Button */}
      <button
        onClick={generateCompleteDesign}
        disabled={isGenerating}
        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl text-white font-bold flex items-center justify-center gap-3 transition-all hover:brightness-110 disabled:opacity-50"
      >
        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
        {isGenerating ? "Designing..." : "Generate AI Design"}
      </button>

      {/* Preview Panel */}
      {showPreview && (
        <div className="glass-brilliant p-4 rounded-xl border border-border space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest">
              Preview Design
            </h4>
            <button onClick={() => setShowPreview(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Logic to show Conflicts */}
          {conflicts.length > 0 && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-[10px] text-red-400 font-bold mb-1">
                CONFLICTS DETECTED
              </p>
              {conflicts.map((c, i) => (
                <p key={i} className="text-[10px] text-red-300">
                  • {c.message}
                </p>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleAcceptDesign(false)}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold"
            >
              Accept Design
            </button>
            {conflicts.length > 0 && (
              <button
                onClick={() => handleAcceptDesign(true)}
                className="flex-1 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold"
              >
                Force Accept
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
