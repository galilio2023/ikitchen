'use client';

import React from 'react';
import { LucideIcon, Database, Zap, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    color?: 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'gray';
    unit?: string;
}

export default function MagicStatsCard({ title, value, iconName, color, unit }: MagicStatsCardProps) {
    const Icon = iconMap[iconName]; // Look up the icon component
    
    // Map color prop to semantic background classes
    const colorClass = color ? {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        amber: 'bg-amber-500',
        red: 'bg-red-500',
        gray: 'bg-gray-500',
    }[color] : '';

    return (
        <div className={cn("card p-6 flex flex-col justify-between bg-card/80 backdrop-blur-sm text-card-foreground border border-border/50 shadow-sm hover:shadow-md transition-shadow", colorClass)}>
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-card-foreground/90">{title}</h3>
                {Icon && <Icon className="w-6 h-6 text-foreground/60" />}
            </div>
            <div>
                <p className="text-4xl font-bold text-card-foreground">
                    {value}
                    {unit && <span className="text-lg font-medium ml-1 text-foreground/60">{unit}</span>}
                </p>
            </div>
        </div>
    );
}
