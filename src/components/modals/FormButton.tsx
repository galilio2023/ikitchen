'use client';

import React from 'react';
import { Zap, Loader2 } from 'lucide-react';

interface FormButtonProps {
    loading: boolean;
    label: string;
}

export default function FormButton({ loading, label }: FormButtonProps) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-14 rounded-[1.5rem] bg-magic-purple text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em] hover:bg-magic-purple/80 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <>
                    <Zap size={16} />
                    {label}
                </>
            )}
        </button>
    );
}