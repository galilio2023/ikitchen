import React, { useTransition, useState } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { applyAiLayout } from '@/actions/projectActions';
import { GeneratedDesign } from '@/lib/validations';

const AiDesignPanel: React.FC = () => {
  const { currentKitchen, validationErrors, updateKitchen } = useKitchenStore(state => state);
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateClick = async () => {
    if (!currentKitchen || hasValidationErrors) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate/kitchen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kitchenId: currentKitchen.id,
          kitchen: currentKitchen,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate layout');
      }
      
      const result = await response.json();
      
      // Update the kitchen with the generated design
      if (result.success && result.design) {
        const updatedKitchen = {
          ...currentKitchen,
          generatedDesign: result.design,
        };
        
        // Update the store with the new kitchen state
        updateKitchen(updatedKitchen);
      }
    } catch (error) {
      console.error('Error generating layout:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptClick = () => {
    if (currentKitchen?.id && currentKitchen.generatedDesign) {
      const design = currentKitchen.generatedDesign as GeneratedDesign;
      startTransition(() => {
        applyAiLayout(currentKitchen.id, design);
      });
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
          {isGenerating ? "Generating..." : "Generate Layout"}
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
            <button onClick={handleAcceptClick} disabled={isPending} className="btn btn-primary flex-1">
              {isPending ? "Applying..." : "Apply Layout"}
            </button>
            <button disabled={isPending} className="btn btn-secondary flex-1">
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
