'use client';

import { IKitchen } from "@/types/kitchen";
import { IProject } from "@/models/Project";
import { Phone, MapPin, DollarSign, Github, ExternalLink, ShieldCheck } from "lucide-react";

export default function ProjectInfo({ project, kitchen }: { project: IProject | null, kitchen: IKitchen | null }) {
    return (
        <div className="flex flex-col gap-2 h-full bg-transparent">
            {/* Contact & Location */}
            <div className="animate-reveal glass-brilliant p-3 rounded-2xl space-y-1 bg-transparent flex-1">
                <h3 className="text-[7px] font-black uppercase tracking-[0.4em] text-foreground/30 mb-0.5">Entity</h3>
                
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-accent/30 border border-border text-magic-purple">
                        <Phone size={10} />
                    </div>
                    <div>
                        <p className="text-[6px] font-black text-foreground/20 uppercase tracking-widest">Phone</p>
                        <p className="text-[8px] font-mono text-foreground">{kitchen?.phone || "DISCONNECTED"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-accent/30 border border-border text-magic-purple">
                        <MapPin size={10} />
                    </div>
                    <div>
                        <p className="text-[6px] font-black text-foreground/20 uppercase tracking-widest">Site</p>
                        <p className="text-[8px] font-mono text-foreground truncate max-w-[100px]">{kitchen?.address || "NOT_SET"}</p>
                    </div>
                </div>
            </div>

            {/* Financial & Status */}
            <div className="animate-reveal glass-brilliant p-3 rounded-2xl space-y-1 bg-transparent flex-1">
                <h3 className="text-[7px] font-black uppercase tracking-[0.4em] text-foreground/30 mb-0.5">Resources</h3>
                
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-accent/30 border border-border text-emerald-400">
                        <DollarSign size={10} />
                    </div>
                    <div>
                        <p className="text-[6px] font-black text-foreground/20 uppercase tracking-widest">Budget</p>
                        <p className="text-[8px] font-mono text-foreground">${kitchen?.totalPrice?.toLocaleString() || "0"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-accent/30 border border-border text-magic-cyan">
                        <ShieldCheck size={10} />
                    </div>
                    <div>
                        <p className="text-[6px] font-black text-foreground/20 uppercase tracking-widest">Status</p>
                        <p className="text-[8px] font-mono text-foreground uppercase">{kitchen?.status === 'installed' ? 'STABLE' : 'UNVERIFIED'}</p>
                    </div>
                </div>
            </div>

            {/* External Links */}
            <div className="animate-reveal glass-brilliant p-3 rounded-2xl space-y-1 bg-transparent flex-1">
                <h3 className="text-[7px] font-black uppercase tracking-[0.4em] text-foreground/30 mb-0.5">Links</h3>
                
                <div className="flex gap-2">
                    <a 
                        href={project?.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-between p-1.5 rounded-lg bg-accent/30 border border-border hover:bg-accent/50 transition-all group"
                    >
                        <div className="flex items-center gap-1.5">
                            <Github size={10} className="text-foreground/40 group-hover:text-foreground" />
                            <span className="text-[6px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-foreground">Src</span>
                        </div>
                    </a>

                    <a 
                        href={project?.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-between p-1.5 rounded-lg bg-accent/30 border border-border hover:bg-accent/50 transition-all group"
                    >
                        <div className="flex items-center gap-1.5">
                            <ExternalLink size={10} className="text-foreground/40 group-hover:text-foreground" />
                            <span className="text-[6px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-foreground">Live</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
