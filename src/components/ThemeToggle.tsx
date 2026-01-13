'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-10 w-10" />;
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-10 w-10 rounded-2xl flex items-center justify-center text-foreground/40 hover:text-primary transition-all border border-border hover:bg-accent relative group"
            title="Toggle Theme"
        >
            {theme === 'dark' ? (
                <Sun size={18} className="group-hover:rotate-45 transition-transform duration-500" />
            ) : (
                <Moon size={18} className="group-hover:-rotate-12 transition-transform duration-500" />
            )}
            <span className="sr-only">Toggle theme</span>
            
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
        </button>
    );
}
