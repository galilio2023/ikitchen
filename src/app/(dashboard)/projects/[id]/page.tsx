'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchKitchenById } from '@/lib/features/kitchens/kitchenSlice';
import { useParams } from 'next/navigation';
import ProjectHero from '@/components/project-details/ProjectHero';
import ProjectInfo from '@/components/project-details/ProjectInfo';
import SpatialEditor from '@/components/kitchen/SpatialEditor';
import { Database, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import SignalLost from '@/components/ui/SignalLost';
import gsap from 'gsap';

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { currentKitchen: kitchen, currentProject: project, loading, error } = useAppSelector((state) => state.kitchen);
    const pageRef = useRef<HTMLDivElement>(null);
    const spinnerRef = useRef<HTMLDivElement>(null);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchKitchenById(id as string));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (!loading && project && !showContent) {
            const tl = gsap.timeline({
                onComplete: () => setShowContent(true)
            });

            tl.to(spinnerRef.current, {
                autoAlpha: 0,
                duration: 0.8,
                ease: "power2.inOut"
            })
            .from(".animate-reveal", {
                y: 30,
                autoAlpha: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out"
            }, "-=0.4");
        }
    }, [loading, project, showContent]);

    if (error && !project) {
        return <SignalLost error={error} />;
    }


    return (
        <div ref={pageRef} className="h-full flex flex-col overflow-hidden bg-transparent">
            {/* Uplink Spinner Layer */}
            {!showContent && (
                <div 
                    ref={spinnerRef}
                    className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center gap-4"
                >
                    <div className="w-12 h-12 border-2 border-magic-cyan border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
                    <p className="text-[10px] font-mono text-magic-cyan uppercase animate-pulse tracking-[0.4em]">Establishing_Uplink...</p>
                    <p className="text-[8px] font-mono text-magic-cyan/40 uppercase tracking-[0.2em] mt-2">Neural_Link_Establishing</p>
                </div>
            )}

            {project && (
                <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-8 lg:p-10 pt-4">
                    {/* Header / Breadcrumb */}
                    <div className="flex-none flex items-center justify-between mb-4 animate-reveal">
                        <Link 
                            href="/dashboard"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors group"
                        >
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back_to_Dashboard
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                            <span className="text-[9px] font-mono text-foreground/40 uppercase tracking-[0.3em]">Direct_Sync_Active</span>
                        </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
                        {/* Spatial Editor Section - THE BIGGEST ONE */}
                        <section className="flex-[4] flex flex-col min-h-0 space-y-2 animate-reveal">
                            <div className="flex-none flex items-center justify-between mb-2">
                                <div className="space-y-1">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/80">Spatial_Registry</h2>
                                    <p className="text-[9px] font-mono text-foreground/20 uppercase tracking-widest">Architectural_Node_Manipulation</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 glass-brilliant rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-border bg-transparent min-h-0">
                                <SpatialEditor />
                            </div>
                        </section>

                        {/* Metadata Sidebar - THE SMALL ONE */}
                        <div className="flex-[1] flex flex-col gap-4 lg:max-w-[320px] min-h-0">
                            <div className="flex-none h-32 animate-reveal">
                                <ProjectHero project={project} />
                            </div>
                        
                            <div className="flex-1 animate-reveal min-h-0 overflow-hidden">
                                <ProjectInfo project={project} kitchen={kitchen} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}