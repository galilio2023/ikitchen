'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function ModalWrapper({ isOpen, onClose, title, children }: ModalWrapperProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[50] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg glass-brilliant rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/20 flex items-center justify-between bg-white/[0.01]">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] !text-white/80">{title}</h2>
                            <button 
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
