'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { IKitchen } from '@/types/kitchen';
import { CardHeader } from './CardHeader';
import { CardIdentity } from './CardIdentity';
import { CardIntegrity } from './CardIntegrity';
import { CardFooter } from './CardFooter';
import gsap from 'gsap';

interface ProjectCardProps {
    project: IKitchen;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const id = project?._id || project?.id;
    const isCompleted = project?.progress === 100;
    const shimmerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!shimmerRef.current) return;

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        tl.fromTo(shimmerRef.current, 
            { x: '-150%', skewX: -20 }, 
            { x: '150%', duration: 1.5, ease: 'power2.inOut' }
        );

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <motion.div
            whileHover={{ scale: 1.01, y: -5 }}
            className="group relative glass-brilliant p-8 rounded-[2.5rem] transition-all duration-500 hover:border-magic-purple/40 h-full flex flex-col justify-between border-border bg-transparent"
        >
            {/* GSAP Shimmer Overlay */}
            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                <div 
                    ref={shimmerRef}
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    style={{ transform: 'translateX(-150%) skewX(-20deg)' }}
                />
            </div>
            {/* 1. AMBIENT LIGHT LEAKS */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-magic-purple)]/5 blur-[50px] group-hover:bg-[var(--color-magic-purple)]/15 transition-colors pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--color-magic-cyan)]/5 blur-[50px] group-hover:bg-[var(--color-magic-cyan)]/15 transition-colors pointer-events-none" />

            <CardHeader 
                id={String(id || '')} 
                status={project?.status} 
                isCompleted={isCompleted} 
            />

            <CardIdentity 
                clientName={project?.clientName} 
                img={project?.img} 
                tags={project?.tags} 
            />

            <CardIntegrity 
                progress={project?.progress || 0} 
                isCompleted={isCompleted} 
            />

            <CardFooter id={String(id || '')} />
        </motion.div>
    );
}