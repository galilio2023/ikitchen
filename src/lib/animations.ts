/**
 * Enterprise Animation System
 * Coordinated GSAP and Framer Motion utilities for magical interactions
 */

import gsap from 'gsap';
import { Variants } from 'framer-motion';

// ============================================
// GSAP Animation Presets
// ============================================

export const gsapAnimations = {
    // Fade and slide up entrance
    fadeUp: (element: HTMLElement | string, delay = 0) => {
        return gsap.from(element, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay,
            ease: 'power3.out',
            clearProps: 'all'
        });
    },

    // Stagger children animation
    staggerChildren: (container: HTMLElement | string, childSelector: string) => {
        return gsap.from(`${container} ${childSelector}`, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'all'
        });
    },

    // Scale and fade entrance
    scaleIn: (element: HTMLElement | string, delay = 0) => {
        return gsap.from(element, {
            scale: 0.9,
            opacity: 0,
            duration: 0.7,
            delay,
            ease: 'back.out(1.2)',
            clearProps: 'all'
        });
    },

    // Magnetic hover effect
    magneticHover: (element: HTMLElement) => {
        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(element, {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    },

    // Glow pulse animation
    glowPulse: (element: HTMLElement | string) => {
        return gsap.to(element, {
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
    },

    // Shimmer loading effect
    shimmer: (element: HTMLElement | string) => {
        const tl = gsap.timeline({ repeat: -1 });
        tl.fromTo(element,
            { backgroundPosition: '-200% 0' },
            { backgroundPosition: '200% 0', duration: 2, ease: 'none' }
        );
        return tl;
    },

    // Page transition
    pageTransition: {
        enter: (element: HTMLElement | string) => {
            return gsap.from(element, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power3.out'
            });
        },
        exit: (element: HTMLElement | string) => {
            return gsap.to(element, {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: 'power3.in'
            });
        }
    }
};

// ============================================
// Framer Motion Variants
// ============================================

export const motionVariants = {
    // Container animations
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    },

    // Item animations
    item: {
        hidden: { 
            y: 30, 
            opacity: 0,
            scale: 0.95
        },
        visible: { 
            y: 0, 
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        }
    },

    // Card hover effect
    card: {
        initial: { 
            scale: 1,
            y: 0
        },
        hover: { 
            scale: 1.02,
            y: -8,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 20
            }
        },
        tap: { 
            scale: 0.98,
            transition: {
                duration: 0.1
            }
        }
    },

    // Fade slide variants
    fadeSlideUp: {
        initial: { 
            opacity: 0, 
            y: 40 
        },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
        exit: { 
            opacity: 0, 
            y: -40,
            transition: {
                duration: 0.4
            }
        }
    },

    // Modal animations
    modal: {
        overlay: {
            hidden: { opacity: 0 },
            visible: { 
                opacity: 1,
                transition: { duration: 0.3 }
            },
            exit: { 
                opacity: 0,
                transition: { duration: 0.2 }
            }
        },
        content: {
            hidden: { 
                opacity: 0, 
                scale: 0.9,
                y: 20
            },
            visible: { 
                opacity: 1, 
                scale: 1,
                y: 0,
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                }
            },
            exit: { 
                opacity: 0, 
                scale: 0.95,
                y: 10,
                transition: { duration: 0.2 }
            }
        }
    },

    // Sidebar animations
    sidebar: {
        open: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 35
            }
        },
        closed: {
            x: '-100%',
            opacity: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 35
            }
        }
    },

    // Dropdown animations
    dropdown: {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: -10
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.2,
                ease: 'easeOut'
            }
        }
    },

    // Notification animations
    notification: {
        initial: { 
            opacity: 0, 
            x: 100,
            scale: 0.8
        },
        animate: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 500,
                damping: 30
            }
        },
        exit: { 
            opacity: 0, 
            x: 100,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    },

    // Loading spinner
    spinner: {
        rotate: {
            rotate: 360,
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
            }
        }
    },

    // Pulse animation
    pulse: {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        }
    }
} satisfies Record<string, Variants | { [key: string]: Variants }>;

// ============================================
// Transition Presets
// ============================================

export const transitions = {
    smooth: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    spring: { type: 'spring', stiffness: 400, damping: 30 },
    snappy: { type: 'spring', stiffness: 500, damping: 35 },
    bounce: { type: 'spring', stiffness: 300, damping: 20 },
    slow: { duration: 0.6, ease: 'easeInOut' },
    fast: { duration: 0.15, ease: 'easeOut' }
} as const;

// ============================================
// Custom Hooks
// ============================================

export const useScrollAnimation = () => {
    if (typeof window === 'undefined') return;
    
    const elements = document.querySelectorAll('[data-scroll-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(entry.target, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
};

// ============================================
// Utility Functions
// ============================================

export const animationUtils = {
    // Create coordinated timeline
    createTimeline: (options?: gsap.TimelineVars) => {
        return gsap.timeline({
            defaults: { ease: 'power3.out', duration: 0.6 },
            ...options
        });
    },

    // Kill all animations on element
    killAll: (element: HTMLElement | string) => {
        gsap.killTweensOf(element);
    },

    // Pause all animations
    pauseAll: () => {
        gsap.globalTimeline.pause();
    },

    // Resume all animations
    resumeAll: () => {
        gsap.globalTimeline.resume();
    }
};

// ============================================
// Performance Optimization
// ============================================

export const optimizeAnimations = () => {
    // Use will-change for animated elements
    gsap.defaults({
        force3D: true,
        lazy: false
    });

    // Reduce motion for accessibility
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.timeScale(0.1);
    }
};
