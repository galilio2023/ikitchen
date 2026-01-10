'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Zap, Layout, User, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/lib/hooks'; // REDUX HOOK
import { addProjectThunk } from '@/lib/features/projects/projectSlice'; // REDUX ACTION
import { toast } from 'sonner';

export default function CreateProjectModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // --- NEW: INPUT STATES ---
    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        setMounted(true);
    }, []);

    // --- NEW: SUBMIT HANDLER ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !client) return toast.error("DATA_INCOMPLETE: FILL_ALL_FIELDS");

        setIsSubmitting(true);
        try {
            const resultAction = await dispatch(addProjectThunk({
                name,
                client,
                status: 'Draft',
                progress: 0
            }));

            if (addProjectThunk.fulfilled.match(resultAction)) {
                toast.success("NODE_INITIALIZED_SUCCESSFULLY");
                setIsOpen(false);
                setName('');
                setClient('');
            } else {
                toast.error("CONNECTION_FAILURE: CHECK_CORE_API");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 isolate">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                        onClick={() => !isSubmitting && setIsOpen(false)}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="glass-brilliant w-full max-w-xl rounded-[3rem] p-10 md:p-12 relative bg-black border border-white/10"
                    >
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-magic-purple/20 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">
                                    Init<span className="text-white/20 not-italic">_Node</span>
                                </h2>
                                <p className="text-[9px] font-mono text-magic-purple uppercase tracking-[0.4em] mt-2">
                                    Deployment_Interface_Active
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white border border-white/5"
                                disabled={isSubmitting}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <FormInput
                                    label="Registry_Name"
                                    icon={<Layout size={14} />}
                                    placeholder="ENTER_PROJECT_TITLE"
                                    value={name}
                                    onChange={(val) => setName(val)}
                                />
                                <FormInput
                                    label="Operator_ID"
                                    icon={<User size={14} />}
                                    placeholder="ASSIGN_CLIENT_ID"
                                    value={client}
                                    onChange={(val) => setClient(val)}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 h-14 rounded-2xl border border-white/10 text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-widest"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-14 bg-magic-purple rounded-2xl text-[10px] font-black text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:brightness-110 active:scale-95 transition-all border-t border-white/20 disabled:opacity-50"
                                >
                                    <div className="flex items-center justify-center gap-2 tracking-[0.2em]">
                                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} fill="currentColor" />}
                                        {isSubmitting ? "PROCESSING..." : "INITIALIZE"}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="glass-brilliant glass-shine group relative flex items-center gap-3 px-6 h-12 rounded-2xl bg-magic-purple/10 border-magic-purple/30 hover:bg-magic-purple/20 transition-all duration-500 overflow-hidden"
            >
                <Plus size={18} className="text-magic-purple group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white font-mono relative z-10">
                    Initialize_Node
                </span>
            </button>

            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}

// --- UPDATED SUB-COMPONENT ---
function FormInput({ label, icon, placeholder, value, onChange }: {
    label: string, icon: React.ReactNode, placeholder: string, value: string, onChange: (val: string) => void
}) {
    return (
        <div className="space-y-2 group">
            <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black ml-2 group-focus-within:text-magic-purple transition-colors font-mono">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-magic-purple transition-colors">
                    {icon}
                </div>
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 pl-14 pr-4 rounded-2xl text-[11px] text-white placeholder:text-white/10 focus:outline-none focus:border-magic-purple/50 focus:bg-white/[0.07] transition-all font-mono"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}