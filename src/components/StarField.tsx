'use client';

import React, { useEffect, useState } from 'react';

interface Star {
    id: number;
    top: string;
    left: string;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
}

export default function StarField({ starCount = 100 }: { starCount?: number }) {
    const [stars, setStars] = useState<Star[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const generatedStars = Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2,
            opacity: Math.random() * 0.5 + 0.3
        }));
        setStars(generatedStars);
    }, [starCount]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-zinc-950">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                        boxShadow: star.size > 2 ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.8)_100%)]" />
        </div>
    );
}