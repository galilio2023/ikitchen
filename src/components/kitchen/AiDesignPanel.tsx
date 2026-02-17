'use client';

import React, { useTransition, useState, useEffect } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { AlertTriangle, ShieldCheck, Loader2, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { applyAiLayout, generateAiLayout } from '@/actions/aiActions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { IAppliance } from '@/types/kitchen';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    if (isGenerating) {
        setLoadingStep(0);
        const interval = setInterval(() => {
            setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
        }, 1500);
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
    <div className="card p-6 relative overflow-hidden bg-gradient-to-b from-card to-muted/20">
      {/* Narrative Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-6"
            >
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
                    <div className="relative bg-card p-4 rounded-full shadow-xl border border-primary/20">
                        <Sparkles className="text-primary animate-spin-slow" size={32} />
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2">Designing your kitchen</h3>
                
                <div className="h-6 overflow-hidden relative w-full max-w-xs">
                    <AnimatePresence mode='wait'>
                        <motion.p 
                            key={loadingStep}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-muted-foreground absolute w-full font-medium"
                        >
                            {LOADING_STEPS[loadingStep]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Sparkles size={20} />
        </div>
        <div>
            <h2 className="text-base font-bold">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Automated layout generation</p>
        </div>
      </div>

      {hasValidationErrors ? (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl mb-6">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
            <AlertTriangle size={16} />
            Layout Issues Detected
          </h3>
          <ul className="text-xs space-y-1 pl-1">
            {validationErrors.map((err, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !currentKitchen?.generatedDesign && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl mb-6">
                <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">Layout is valid and ready.</span>
            </div>
        )
      )}

      <div className="mb-6">
        <button
          onClick={handleGenerateClick}
          disabled={hasValidationErrors || isGenerating || isApplying}
          className={cn(
            "btn w-full h-12 text-sm gap-2 relative overflow-hidden group transition-all duration-300",
            hasValidationErrors 
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
          )}
        >
          <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
            {isGenerating ? 'Generating...' : 'Generate Layout'}
          </span>
          {!hasValidationErrors && (
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          )}
        </button>
      </div>

      {currentKitchen?.generatedDesign && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">AI Proposal</h3>
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">New</span>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {currentKitchen.generatedDesign.aiReasoning}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={handleDiscardClick} 
                disabled={isApplying} 
                className="btn btn-outline h-9 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <XCircle size={14} className="mr-2" />
              Discard
            </button>
            <button 
                onClick={handleAcceptClick} 
                disabled={isApplying} 
                className="btn btn-primary h-9 text-xs"
            >
              {isApplying ? <Loader2 className="animate-spin mr-2" size={14} /> : <CheckCircle2 size={14} className="mr-2" />}
              {isApplying ? "Applying..." : "Apply"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AiDesignPanel;
