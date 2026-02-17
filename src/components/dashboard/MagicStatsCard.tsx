"use client";

import React from "react";
import { LucideIcon, Database, Zap, Cpu, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: { [key: string]: LucideIcon } = {
  database: Database,
  zap: Zap,
  cpu: Cpu,
  activity: Activity,
};

interface MagicStatsCardProps {
  title: string;
  value: string;
  iconName: keyof typeof iconMap;
  color?: "blue" | "green" | "purple" | "amber" | "red" | "gray";
  unit?: string;
}

export default function MagicStatsCard({
  title,
  value,
  iconName,
  color = "blue",
  unit,
}: MagicStatsCardProps) {
  const Icon = iconMap[iconName];

  const colorStyles = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    purple: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    red: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    gray: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800",
  };

  const activeStyle = colorStyles[color];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between",
        "bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300",
        "hover:border-primary/20"
      )}
    >
      <div className={cn(
          "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          color === 'blue' && "bg-blue-500",
          color === 'green' && "bg-emerald-500",
          color === 'purple' && "bg-violet-500",
          color === 'amber' && "bg-amber-500",
      )} />

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          {title}
        </h3>
        {Icon && (
          <div className={cn("p-2 rounded-lg transition-colors", activeStyle)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1">
        <p className="text-3xl font-bold text-foreground tracking-tight">
          {value}
        </p>
        {unit && (
          <span className="text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
