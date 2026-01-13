'use client';

import { useEffect, useRef } from "react";
import { IKitchen } from "@/types/kitchen";
import { cn } from "@/lib/utils";
import ProjectCard from "./project-card/ProjectCard";
import EmptyDashboard from "./EmptyDashboard";
import gsap from "gsap";

interface ProjectGridProps {
    projects: IKitchen[];
    isSearch?: boolean;
}

export default function ProjectGrid({ projects, isSearch }: ProjectGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gridRef.current || projects.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.from(".project-card-wrapper", {
                y: 20,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                clearProps: "all"
            });
        }, gridRef);

        return () => ctx.revert();
    }, [projects]);

    if (projects.length === 0) {
        return <EmptyDashboard error={isSearch ? "NO_MATCHES_IN_REGISTRY" : null} />;
    }

    return (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: IKitchen, index: number) => (
                <div 
                    key={project._id?.toString() || project.id}
                    className={cn(
                        "project-card-wrapper",
                        index % 4 === 0 ? "md:col-span-2 md:row-span-1" : 
                        index % 4 === 3 ? "md:col-span-1 md:row-span-2" : ""
                    )}
                >
                    <ProjectCard project={project} />
                </div>
            ))}
        </div>
    );
}
