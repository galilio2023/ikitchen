'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // The "Teleport" function
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Zap, Layout, User } from 'lucide-react';

export default function CreateProjectModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure we are on the client before attempting to portal
    useEffect(() => {
        setMounted(true);
    }, []);

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 isolate">
                    {/* 1. BACKDROP: Pure background isolation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* 2. MODAL BOX: Now truly on top of the world */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="glass-brilliant w-full max-w-xl rounded-[3rem] p-10 md:p-12 relative bg-black shadow-[0_0_100px_rgba(139,92,246,0.1)] border border-white/10"
                    >
                        {/* SPECULAR LIGHT LEAK (The Obsidian Touch) */}
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
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-6">
                                <FormInput label="Registry_Name" icon={<Layout size={14} />} placeholder="ENTER_PROJECT_TITLE" />
                                <FormInput label="Operator_ID" icon={<User size={14} />} placeholder="ASSIGN_CLIENT_ID" />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 h-14 rounded-2xl border border-white/10 text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 h-14 bg-magic-purple rounded-2xl text-[10px] font-black text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:brightness-110 active:scale-95 transition-all border-t border-white/20"
                                >
                                    <div className="flex items-center justify-center gap-2 tracking-[0.2em]">
                                        <Zap size={14} fill="currentColor" />
                                        INITIALIZE
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
            {/* The Trigger stays in the Navbar/Header */}
            <button
                onClick={() => setIsOpen(true)}
                className="glass-brilliant glass-shine group relative flex items-center gap-3 px-6 h-12 rounded-2xl bg-magic-purple/10 border-magic-purple/30 hover:bg-magic-purple/20 transition-all duration-500 overflow-hidden"
            >
                <Plus size={18} className="text-magic-purple group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white font-mono relative z-10">
                    Initialize_Node
                </span>
            </button>

            {/* The Portal teleports the content to the body */}
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}

function FormInput({ label, icon, placeholder }: { label: string, icon: React.ReactNode, placeholder: string }) {
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
                    className="w-full h-14 bg-white/[0.03] border border-white/10 pl-14 pr-4 rounded-2xl text-[11px] text-white placeholder:text-white/10 focus:outline-none focus:border-magic-purple/50 focus:bg-white/[0.07] transition-all font-mono"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}