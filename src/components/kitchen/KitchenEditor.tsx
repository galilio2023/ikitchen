'use client';

import React, { useState } from "react";
import { useKitchenStore } from "@/providers/KitchenStoreProvider";
import { Loader2, Users, LayoutDashboard, Monitor } from "lucide-react";
import B2cConfigurator from "@/components/kitchen/B2cConfigurator";
import ShowroomMode from "@/components/kitchen/ShowroomMode";
import { cn } from "@/lib/utils";

type Mode = "b2c" | "b2b";

export default function KitchenEditor() {
  const store = useKitchenStore((state) => state);
  const [mode, setMode] = useState<Mode>("b2c");

  if (!store.currentKitchen) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-4 bg-background text-foreground min-h-[calc(100vh-3.5rem)]">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground text-sm font-medium">جاري تحميل النظام...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background text-foreground">
      {/* Mode switcher header (hidden during printing) */}
      <div className="flex-none bg-muted/30 border-b border-border/80 px-4 md:px-8 py-2.5 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-bold text-muted-foreground font-mono">
            {mode === "b2c" ? "وضع العميل B2C (Consumer Mode)" : "وضع المعرض B2B (Showroom Mode)"}
          </span>
        </div>

        {/* Action Toggle Switch */}
        <div className="flex bg-card border border-border p-1 rounded-xl">
          <button
            onClick={() => setMode("b2c")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              mode === "b2c" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Monitor size={12} />
            <span>بوابة المستهلك B2C</span>
          </button>
          <button
            onClick={() => setMode("b2b")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              mode === "b2b" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Users size={12} />
            <span>بوابة المبيعات B2B</span>
          </button>
        </div>
      </div>

      {/* Dynamic view */}
      <div className="flex-1 flex flex-col min-h-0">
        {mode === "b2c" ? (
          <B2cConfigurator />
        ) : (
          <ShowroomMode />
        )}
      </div>
    </div>
  );
}
