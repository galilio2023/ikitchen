'use client';

import { Plus } from "lucide-react";
import { useUIStore } from "@/lib/store/uiStore";

export default function CreateProjectModal() {
    const { openModal } = useUIStore();

    return (
        <button 
            onClick={openModal}
            className="btn btn-primary gap-2 px-6 py-3 text-xs tracking-widest"
        >
            <Plus size={14} />
            New Project
        </button>
    );
}
