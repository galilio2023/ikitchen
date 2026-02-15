"use client";

import React from "react";
import { LucideIcon, Database, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

// A mapping from string names to the actual icon components
const iconMap: { [key: string]: LucideIcon } = {
  database: Database,
  zap: Zap,
  cpu: Cpu,
};

interface MagicStatsCardProps {
  title: string;
  value: string;
  iconName: keyof typeof iconMap; // We now accept a string name
  color?: "blue" | "green" | "purple" | "amber" | "red" | "gray";
  unit?: string;
}

export default function MagicStatsCard({
  title,
  value,
  iconName,
  color,
  unit,
}: MagicStatsCardProps) {
  const Icon = iconMap[iconName]; // Look up the icon component

  // Map color prop to semantic border classes
  const borderColorClass = color
    ? {
        blue: "border-t-blue-500",
        green: "border-t-green-500",
        purple: "border-t-purple-500",
        amber: "border-t-amber-500",
        red: "border-t-red-500",
        gray: "border-t-gray-500",
      }[color]
    : "border-t-transparent";

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl p-6 flex flex-col justify-between bg-card/90 backdrop-blur-xl text-card-foreground border-t-4 border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1",
        borderColorClass,
      )}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-base font-semibold text-card-foreground/80">
          {title}
        </h3>
        {Icon && (
          <Icon className="w-6 h-6 text-foreground/50 group-hover:text-foreground/70 transition-colors" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-5xl font-bold text-card-foreground">
          {value}
          {unit && (
            <span className="text-xl font-medium ml-1.5 text-foreground/50">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
