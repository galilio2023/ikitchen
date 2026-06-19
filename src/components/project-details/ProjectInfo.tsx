'use client';

import { IKitchen } from "@/types/kitchen";
import { Project } from "@prisma/client";
import { Phone, MapPin, DollarSign, Github, ExternalLink, ShieldCheck, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectInfo({ project, kitchen }: { project: Project | null, kitchen: IKitchen | null }) {
    if (!project || !kitchen) return null;

    const InfoRow = ({ icon: Icon, label, value, href }: { icon: any, label: string, value: string, href?: string }) => (
        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-muted rounded-md text-muted-foreground">
                    <Icon size={14} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
            {href ? (
                <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                    {value} <ExternalLink size={10} />
                </a>
            ) : (
                <span className="text-xs font-semibold text-foreground truncate max-w-[120px]" suppressHydrationWarning>{value}</span>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Client Details */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                    <User size={12} /> Client Details
                </h3>
                <div className="bg-card border rounded-xl p-4 shadow-sm">
                    <InfoRow icon={User} label="Name" value={kitchen.clientName || "Unknown"} />
                    <InfoRow icon={Phone} label="Phone" value={kitchen.phone || "Not set"} />
                    <InfoRow icon={MapPin} label="Address" value={kitchen.address || "Not set"} />
                </div>
            </div>

            {/* Project Status */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                    <ShieldCheck size={12} /> Status & Budget
                </h3>
                <div className="bg-card border rounded-xl p-4 shadow-sm">
                    <InfoRow 
                        icon={DollarSign} 
                        label="Budget" 
                        value={kitchen.totalPrice ? `$${kitchen.totalPrice.toLocaleString()}` : "$0"} 
                    />
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-muted rounded-md text-muted-foreground">
                                <ShieldCheck size={14} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Status</span>
                        </div>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            kitchen.status === 'installed' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            kitchen.status === 'ordered' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        )}>
                            {kitchen.status || "Draft"}
                        </span>
                    </div>
                    <InfoRow 
                        icon={Calendar} 
                        label="Created" 
                        value={new Date(project.createdAt || new Date()).toLocaleDateString()} 
                    />
                </div>
            </div>

            {/* Links */}
            {(project.github || project.url) && (
                <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                        <ExternalLink size={12} /> Resources
                    </h3>
                    <div className="bg-card border rounded-xl p-4 shadow-sm">
                        {project.github && <InfoRow icon={Github} label="Repository" value="View Code" href={project.github} />}
                        {project.url && <InfoRow icon={ExternalLink} label="Live Site" value="Visit Link" href={project.url} />}
                    </div>
                </div>
            )}
        </div>
    );
}
