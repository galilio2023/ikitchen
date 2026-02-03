'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { IKitchen } from '@/types/kitchen';
import { ArrowRight, Calendar, TrendingUp, Layers, Sparkles } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motionVariants, transitions } from '@/lib/animations';
import gsap from 'gsap';

interface EnterpriseProjectCardProps {
    project: IKitchen;
}

export default function EnterpriseProjectCard({ project }: EnterpriseProjectCardProps) {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!cardRef.current || !glowRef.current) return;

        const card = cardRef.current;
        const glow = glowRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            gsap.to(glow, {
                background: `radial-gradient(circle at ${x}% ${y}%, rgba(139, 92, 246, 0.15), transparent 50%)`,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        return () => card.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleClick = () => {
        router.push(`/projects/${project._id || project.id}`);
    };

    const getStatusColor = (status: string) => {
        const colors = {
            draft: 'text-muted-foreground bg-muted/30 border-muted/30',
            measuring: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
            designing: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
            ordered: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
            installed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
        };
        return colors[status as keyof typeof colors] || colors.draft;
    };

    const projectId = project._id?.toString() || project.id;
    const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    }) : 'N/A';

    return (
        <motion.div
            ref={cardRef}
            variants={motionVariants.card}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={handleClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative cursor-pointer"
        >
            {/* Animated Glow Effect */}
            <div 
                ref={glowRef}
                className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            />

            {/* Card Container */}
            <div className="relative h-full bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                
                {/* Top Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-magic-purple via-magic-cyan to-magic-purple opacity-60" />

                {/* Mesh Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.05),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Content */}
                <div className="relative p-6 flex flex-col h-full space-y-4">
                    
                    {/* Header Section */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <motion.h3 
                                className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300"
                                animate={isHovered ? { x: 2 } : { x: 0 }}
                                transition={transitions.smooth}
                            >
                                {project.clientName || 'Unnamed Project'}
                            </motion.h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {project.address || 'No address specified'}
                            </p>
                        </div>

                        {/* Status Badge */}
                        <motion.div 
                            className={`flex-none px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(project.status)}`}
                            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                            transition={transitions.spring}
                        >
                            {project.status}
                        </motion.div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Progress</span>
                            <motion.span 
                                className="font-bold text-primary"
                                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                            >
                                {project.progress || 0}%
                            </motion.span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative h-2 bg-accent/30 rounded-full overflow-hidden">
                            <motion.div 
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-magic-purple to-magic-cyan rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress || 0}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                            />
                            {/* Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{
                                    x: ['-100%', '200%']
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                    repeatDelay: 1
                                }}
                            />
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <MetricItem 
                            icon={<Layers size={14} />}
                            label="Walls"
                            value={project.walls?.length || 0}
                        />
                        <MetricItem 
                            icon={<Calendar size={14} />}
                            label="Created"
                            value={createdDate}
                            small
                        />
                        <MetricItem 
                            icon={<TrendingUp size={14} />}
                            label="Items"
                            value={(project.obstacles?.length || 0) + (project.appliances?.length || 0)}
                        />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Footer Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Sparkles size={12} className="text-magic-purple" />
                            <span className="font-medium">AI Ready</span>
                        </div>

                        <motion.div 
                            className="flex items-center gap-2 text-sm font-bold text-primary group-hover:text-magic-cyan transition-colors"
                            animate={isHovered ? { x: 4 } : { x: 0 }}
                            transition={transitions.smooth}
                        >
                            <span>Open</span>
                            <ArrowRight size={16} />
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Corner Accent */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
        </motion.div>
    );
}

// Metric Item Component
function MetricItem({ 
    icon, 
    label, 
    value, 
    small 
}: { 
    icon: React.ReactNode; 
    label: string; 
    value: string | number;
    small?: boolean;
}) {
    return (
        <div className="flex flex-col items-start space-y-1 p-2 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors duration-300">
            <div className="flex items-center gap-1.5 text-muted-foreground">
                {icon}
                <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
            </div>
            <span className={`font-bold text-foreground ${small ? 'text-[10px]' : 'text-sm'}`}>
                {value}
            </span>
        </div>
    );
}
