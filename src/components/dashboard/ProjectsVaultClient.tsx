'use client';

import React from 'react';
import { useUIStore } from '@/lib/store/uiStore';
import ProjectGrid from '@/components/dashboard/ProjectGrid';
import MagicStatsCard from '@/components/dashboard/MagicStatsCard';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  clientName: string;
  status: string;
  progress: number;
  updatedAt: Date;
}

interface ProjectsVaultClientProps {
  projects: Project[];
}

export default function ProjectsVaultClient({ projects }: ProjectsVaultClientProps) {
    const { language } = useUIStore();
    const isAr = language === 'ar';

    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status !== 'Completed').length,
        completed: projects.filter(p => p.status === 'Completed').length
    };

    return (
        <div 
            className="max-w-[1600px] mx-auto space-y-8" 
            dir={isAr ? "rtl" : "ltr"}
        >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                <div className={cn("space-y-1", isAr ? "text-right" : "text-left")}>
                    <span className="text-[10px] tracking-widest text-primary uppercase font-black font-mono">Operations Hub</span>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-1">
                        {isAr 
                            ? "خزينة المشاريع وتصاميم العملاء (Projects Vault)" 
                            : "Projects Registry & Designs Vault"
                        }
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isAr
                            ? "إدارة وتتبع مقايسات المطابخ، ومراجعة نسب الإنجاز والتحديثات الفنية للعملاء."
                            : "Track spatial cabinet specifications, review pipeline metrics, and update client statuses."
                        }
                    </p>
                </div>
            </header>

            {/* Quick Stats Row - localized with identical styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MagicStatsCard
                    title={isAr ? "إجمالي المشاريع والتصاميم" : "Total Projects"}
                    value={stats.total.toString()}
                    iconName="database"
                    color="blue"
                    unit={isAr ? "مشاريع" : "Deals"}
                />
                <MagicStatsCard
                    title={isAr ? "المشاريع قيد التصميم (نشطة)" : "Designing (Active)"}
                    value={stats.active.toString()}
                    iconName="activity"
                    color="amber"
                    unit={isAr ? "نشط" : "Active"}
                />
                <MagicStatsCard
                    title={isAr ? "المعاينات الفنية المكتملة" : "Completed Surveys"}
                    value={stats.completed.toString()}
                    iconName="zap"
                    color="green"
                    unit={isAr ? "مكتمل" : "Done"}
                />
            </div>

            <div className="kitchen-card bg-card/55 backdrop-blur-md overflow-hidden p-6">
                <ProjectGrid projects={projects} showSearch={true} />
            </div>
        </div>
    );
}
