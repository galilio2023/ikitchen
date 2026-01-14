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
            className="group relative glass-brilliant p-10 rounded-[3rem] transition-all duration-500 hover:border-magic-purple/40 h-full flex flex-col border-border bg-transparent shadow-xl hover:shadow-magic-purple/10"
        >
            {/* GSAP Shimmer Overlay */}
            <div className="absolute inset-0 overflow-hidden rounded-[3rem] pointer-events-none">
                <div 
                    ref={shimmerRef}
                    className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-magic-purple/5 to-transparent"
                    style={{ transform: 'translateX(-150%) skewX(-20deg)' }}
                />
            </div>

            {/* 1. AMBIENT LIGHT LEAKS */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-magic-purple/5 blur-[60px] group-hover:bg-magic-purple/15 transition-all duration-700 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-magic-cyan/5 blur-[60px] group-hover:bg-magic-cyan/15 transition-all duration-700 pointer-events-none" />

            <CardHeader 
                id={String(id || '')} 
                status={project?.status} 
                isCompleted={isCompleted} 
                date={project?.createdAt}
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

            <CardFooter 
                id={String(id || '')} 
                totalPrice={project?.totalPrice}
            />
        </motion.div>
    );
}