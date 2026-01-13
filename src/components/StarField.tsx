'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface StarFieldProps {
    starCount?: number;
}

export default function StarField({ starCount = 120 }: { starCount?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const isDark = theme === 'dark';

        // Create stars with stable initial positions
        const stars = Array.from({ length: starCount }).map(() => ({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            pulse: Math.random() * 0.01 + 0.005,
            isViolet: Math.random() > 0.8,
            blinkDir: Math.random() > 0.5 ? 1 : -1
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                // Pulse effect
                star.opacity += star.pulse * star.blinkDir;
                if (star.opacity > 1) {
                    star.opacity = 1;
                    star.blinkDir = -1;
                } else if (star.opacity < 0.2) {
                    star.opacity = 0.2;
                    star.blinkDir = 1;
                }

                const px = star.x * canvas.width;
                const py = star.y * canvas.height;

                ctx.beginPath();
                ctx.arc(px, py, star.size, 0, Math.PI * 2);
                
                const starOpacity = isDark ? star.opacity : star.opacity * 0.2;
                const starColor = isDark 
                    ? (star.isViolet ? `rgba(139, 92, 246, ${starOpacity})` : `rgba(255, 255, 255, ${starOpacity})`)
                    : (star.isViolet ? `rgba(139, 92, 246, ${starOpacity})` : `rgba(15, 23, 42, ${starOpacity})`);

                ctx.fillStyle = starColor;
                
                if (isDark && star.size > 1.5) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = star.isViolet ? '#8b5cf6' : '#ffffff';
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mounted, starCount, theme]);

    if (!mounted) {
        return <div className="fixed inset-0 bg-background z-[-1]" />;
    }

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-transparent">
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
            />
            {/* Ambient Nebula Gradients - Faint in light mode */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)] dark:opacity-100 opacity-10" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-magic-purple/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-magic-purple/10 blur-[150px] rounded-full pointer-events-none" />
        </div>
    );
}