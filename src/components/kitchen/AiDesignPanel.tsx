'use client';

import React, { useTransition, useState, useEffect } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { AlertCircle, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { applyAiLayout, generateAiLayout } from '@/actions/aiActions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { IAppliance } from '@/types/kitchen';

const LOADING_STEPS = [
    "Analyzing floor plan dimensions...",
    "Identifying structural constraints...",
    "Calculating optimal work triangle...",
    "Positioning major appliances...",
    "Generating cabinet layout...",
    "Finalizing design proposal..."
];

const AiDesignPanel: React.FC = () => {
  const { currentKitchen, setKitchen, validationErrors } = useKitchenStore(state => state);
  const [isGenerating, startGenerateTransition] = useTransition();
  const [isApplying, startApplyTransition] = useTransition();
  const [loadingStep, setLoadingStep] = useState(0);

  // Cycle through loading steps
  useEffect(() => {
    if (isGenerating) {
        setLoadingStep(0);
        const interval = setInterval(() => {
            setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
        }, 800); // Change text every 800ms
        return () => clearInterval(interval);
    }
  }, [isGenerating]);

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
    if (currentKitchen && currentKitchen.generatedDesign) {
      const designToApply = currentKitchen.generatedDesign;
      startApplyTransition(async () => {
        const result = await applyAiLayout(currentKitchen.id, designToApply);
        if (result.success && result.appliances) {
          setKitchen({ 
            ...currentKitchen, 
            generatedDesign: undefined, 
            appliances: result.appliances as IAppliance[] 
          });
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
    <div className="card p-6 relative overflow-hidden">
      {/* Narrative Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
            >
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <Sparkles className="relative text-primary animate-spin-slow" size={48} />
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2">Designing your kitchen</h3>
                
                <div className="h-6 overflow-hidden relative w-full">
                    <AnimatePresence mode='wait'>
                        <motion.p 
                            key={loadingStep}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-muted-foreground absolute w-full"
                        >
                            {LOADING_STEPS[loadingStep]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Sparkles size={20} className="text-primary" />
        AI Layout Assistant
      </h2>

      {hasValidationErrors && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground p-4 rounded-lg mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            Layout Errors
          </h3>
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
          disabled={hasValidationErrors || isGenerating || isApplying}
          className="btn btn-primary w-full h-12 text-sm gap-2 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
            {isGenerating ? 'Generating...' : 'Generate Layout'}
          </span>
          {/* Shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
        </button>
        {hasValidationErrors && (
            <p className="text-xs text-destructive text-center mt-2">Please fix layout errors before generating.</p>
        )}
      </div>

      {currentKitchen?.generatedDesign && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/50 border rounded-xl p-4 mb-4"
        >
          <h3 className="font-bold text-sm mb-2">AI Suggestion:</h3>
          <blockquote className="text-sm italic border-l-2 pl-4 mb-4 text-muted-foreground">
            "{currentKitchen.generatedDesign.aiReasoning}"
          </blockquote>
          <div className="flex space-x-3">
            <button onClick={handleAcceptClick} disabled={isApplying} className="btn btn-primary flex-1 gap-2">
              {isApplying && <Loader2 className="animate-spin" size={16} />}
              {isApplying ? "Applying..." : "Apply Layout"}
            </button>
            <button onClick={handleDiscardClick} disabled={isApplying} className="btn btn-secondary flex-1">
              Discard
            </button>
          </div>
        </motion.div>
      )}

      {!currentKitchen?.generatedDesign && !hasValidationErrors && !isGenerating && (
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
