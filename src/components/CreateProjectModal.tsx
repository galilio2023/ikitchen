'use client';

import { Plus } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { openModal } from "@/lib/features/ui/uiSlice";

export default function CreateProjectModal() {
    const dispatch = useAppDispatch();

    return (
        <button 
            onClick={() => dispatch(openModal())}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-magic-purple)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-magic-purple)]/80 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
            <Plus size={14} />
            Initialize_Node
        </button>
    );
}