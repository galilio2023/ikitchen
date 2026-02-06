'use client';

import React, { useTransition } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { applyAiLayout, generateAiLayout } from '@/actions/aiActions';
import { toast } from 'sonner';

const AiDesignPanel: React.FC = () => {
  const { currentKitchen, setKitchen, validationErrors } = useKitchenStore(state => state);
  const [isGenerating, startGenerateTransition] = useTransition();
  const [isApplying, startApplyTransition] = useTransition();

  const handleGenerateClick = () => {
    if (currentKitchen && validationErrors.length === 0) {
      startGenerateTransition(async () => {
        const result = await generateAiLayout(currentKitchen.id);
        if (result.success && result.design) {
          setKitchen({ ...currentKitchen, generatedDesign: result.design });
          toast.success("AI layout suggestion is ready!");
        } else {
          toast.error(result.error || "Failed to generate layout.");
        }
      });
    }
  };

  const handleAcceptClick = () => {
    // Definitive Type Guard: Ensure the design exists before calling the action.
    if (currentKitchen && currentKitchen.generatedDesign) {
      const designToApply = currentKitchen.generatedDesign;
      startApplyTransition(async () => {
        const result = await applyAiLayout(currentKitchen.id, designToApply);
        if (result.success && result.appliances) {
          setKitchen({ ...currentKitchen, generatedDesign: undefined, appliances: result.appliances });
          toast.success("AI design has been applied.");
        } else {
          toast.error(result.error || "Failed to apply design.");
        }
      });
    }
  };

  const handleDiscardClick = () => {
    if(currentKitchen) {
      setKitchen({ ...currentKitchen, generatedDesign: undefined });
      toast.info("AI suggestion discarded.");
    }
  };

  const hasValidationErrors = validationErrors.length > 0;

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4">AI Layout Assistant</h2>

      {hasValidationErrors && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground p-4 rounded-lg mb-4">
          <h3 className="font-bold">Layout Errors</h3>
          <ul className="text-sm list-disc pl-5 mt-2">
            {validationErrors.map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleGenerateClick}
          disabled={hasValidationErrors || isGenerating}
          className="btn btn-primary w-full h-12 text-sm"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate Layout'}
        </button>
        {hasValidationErrors && (
            <p className="text-xs text-destructive text-center mt-2">Please fix layout errors before generating.</p>
        )}
      </div>

      {currentKitchen?.generatedDesign && (
        <div className="bg-muted/50 border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-sm mb-2">AI Suggestion:</h3>
          <blockquote className="text-sm italic border-l-2 pl-4 mb-4">
            {currentKitchen.generatedDesign.aiReasoning}
          </blockquote>
          <div className="flex space-x-3">
            <button onClick={handleAcceptClick} disabled={isApplying} className="btn btn-primary flex-1">
              {isApplying ? "Applying..." : "Apply Layout"}
            </button>
            <button onClick={handleDiscardClick} disabled={isApplying} className="btn btn-secondary flex-1">
              Discard
            </button>
          </div>
        </div>
      )}

      {!currentKitchen?.generatedDesign && !hasValidationErrors && (
        <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-3">
            <ShieldCheck size={32} className="text-green-500" />
            <p className="font-bold">Layout is valid.</p>
            <p className="text-sm mt-1">Ready to generate an AI layout.</p>
        </div>
      )}
    </div>
  );
};

export default AiDesignPanel;
