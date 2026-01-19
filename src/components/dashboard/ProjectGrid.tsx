'use client';

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IKitchen } from "@/types/kitchen";
import EnterpriseProjectCard from "./project-card/EnterpriseProjectCard";
import EmptyDashboard from "./EmptyDashboard";
import { motionVariants } from "@/lib/animations";
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
                y: 40,
                autoAlpha: 0,
                duration: 0.8,
                stagger: {
                    each: 0.12,
                    ease: "power2.out"
                },
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
        <motion.div 
            ref={gridRef} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            variants={motionVariants.container}
            initial="hidden"
            animate="visible"
        >
            {projects.map((project: IKitchen) => (
                <motion.div 
                    key={project._id?.toString() || project.id}
                    className="project-card-wrapper"
                    variants={motionVariants.item}
                >
                    <EnterpriseProjectCard project={project} />
                </motion.div>
            ))}
        </motion.div>
    );
}
