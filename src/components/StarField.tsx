'use client';

import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

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

const Starfield = memo(({ starCount = 150 }: StarfieldProps) => {
    // Increased default count to 150 to make sure they are visible through blur
    const [stars, setStars] = useState<Star[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const generatedStars: Star[] = Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 7,
            size: Math.random() > 0.8 ? 2 : 1, // More size 2 stars for visibility
            glow: Math.random() > 0.8,
        }));

        setStars(generatedStars);
    }, [starCount]);

    // FIX 1: Change bg-black to bg-transparent so it doesn't block the body background
    if (!isMounted) return <div className="fixed inset-0 bg-transparent z-[-2]" />;

    return (
        /* FIX 2: Removed bg-black from here. The 'body' already has bg-black.
           If this container has bg-black, it might overlap other layers incorrectly. */
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-2] bg-transparent">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2], // Start at 0.2 instead of 0
                        scale: star.glow ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut"
                    }}
                    className="absolute rounded-full bg-white"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        /* FIX 4: Stronger glow for depth */
                        boxShadow: star.glow ? '0 0 15px 2px rgba(255, 255, 255, 0.6)' : 'none',
                        willChange: "opacity",
                    }}
                />
            ))}

            {/* VIGNETTE: Keep this but ensure it is subtle */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
});

Starfield.displayName = "Starfield";

export default Starfield;