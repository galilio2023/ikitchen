'use client';

import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

// 1. Define Strict Types
interface Star {
    id: number;
    top: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    glow: boolean;
}

interface StarfieldProps {
    starCount?: number;
}

const Starfield = memo(({ starCount = 60 }: StarfieldProps) => {
    const [stars, setStars] = useState<Star[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // 2. Generate Data with Types
        const generatedStars: Star[] = Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
            size: Math.random() > 0.8 ? 2 : 1, // 20% are larger 2px stars
            glow: Math.random() > 0.9,         // 10% have a soft bloom
        }));

        setStars(generatedStars);
    }, [starCount]);

    // 3. Prevent Hydration Mismatch (Server vs Client HTML must match)
    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] isolate bg-black">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.1, 0.5, 0.1],
                        scale: star.glow ? [1, 1.5, 1] : [1, 1.1, 1]
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "linear"
                    }}
                    className="absolute rounded-full bg-white"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        boxShadow: star.glow ? '0 0 10px 2px rgba(255, 255, 255, 0.3)' : 'none',
                        // High-performance optimization: force GPU layer
                        willChange: "transform, opacity",
                    }}
                />
            ))}
        </div>
    );
});

// Setting DisplayName for debugging (Standard TS/React practice)
Starfield.displayName = "Starfield";

export default Starfield;