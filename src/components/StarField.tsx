'use client';

import { useEffect, useState, useMemo } from 'react';

interface StarFieldProps {
    starCount?: number;
}

export default function StarField({ starCount = 80 }: StarFieldProps) {
    const [mounted, setMounted] = useState(false);

    // 1. Handle the Hydration Gap
    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. Memoize star data to ensure stability on the client
    const stars = useMemo(() => {
        if (!mounted) return [];

        return Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            // Variation in size for depth perception
            size: Math.random() > 0.8 ? '2px' : '1px',
            opacity: Math.random() * 0.7 + 0.1, // range 0.1 to 0.8
            // Varying duration for a "breathing" galaxy effect
            duration: 4 + Math.random() * 6,
            delay: Math.random() * 5,
        }));
    }, [mounted]);

    // During Server-Side Rendering, we return a matching "shell"
    // This prevents the "Hydration Mismatch" error
    if (!mounted) {
        return (
            <div
                className="fixed inset-0 overflow-hidden pointer-events-none z-[-2] bg-black"
                aria-hidden="true"
            />
        );
    }

    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none z-[-2] bg-transparent"
            aria-hidden="true"
        >

            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                        // Using translateZ(0) to force GPU acceleration
                        transform: 'translateZ(0)',
                        willChange: 'opacity',
                        transition: `opacity ${star.duration}s ease-in-out`,
                        // Slight delay so they don't all blink at once
                        transitionDelay: `${star.delay}s`
                    }}
                />
            ))}

            {/* The Deep Space Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
}