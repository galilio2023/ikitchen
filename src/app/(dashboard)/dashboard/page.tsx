'use client';

import { motion } from 'framer-motion';
import { Box, Zap, Database, Cpu } from "lucide-react";
import CreateProjectModal from '@/components/CreateProjectModal';
import { cn } from "@/lib/utils";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
    return (
        <main className="p-8 lg:p-12 space-y-10 max-w-7xl mx-auto relative isolate">
            {/* 1. SPECTACULAR HEADER */}
            <header className="glass-brilliant p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border-white/5">
                {/* Internal Light Source: Breaks the dark inside the header */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-magic-purple/20 blur-[80px] rounded-full pointer-events-none" />

                <div className="flex items-center gap-8 relative z-10">
                    <div className="h-20 w-20 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner relative group backdrop-blur-md">
                        <Box className="text-magic-purple h-10 w-10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute -inset-1 bg-magic-purple/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div>
                        <h1 className="text-5xl font-black tracking-tighter sparkle-text uppercase italic leading-none">
                            Voyager<span className="text-white/20 not-italic">_OS</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-magic-purple animate-pulse shadow-[0_0_10px_#8b5cf6]" />
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Neural_Link: Established</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <CreateProjectModal />
                </div>
            </header>

            {/* 2. SPECULAR STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Live_Nodes" value="12" icon={Database} />
                <StatCard label="System_Health" value="99.9%" icon={Zap} />
                <StatCard label="Processing" value="Nominal" icon={Cpu} />
            </div>

            {/* 3. RECENT ACTIVITY PREVIEW */}
            <section className="glass-brilliant rounded-[2rem] p-8 border-t-2 border-t-magic-purple/30 bg-black/40">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Core_Activity_Log</h2>
                    <button className="text-[9px] text-magic-purple font-bold uppercase tracking-widest hover:brightness-125 transition-all">View_All_Metrics</button>
                </div>

                {/* 🛠️ Improved Placeholder: Fixed the "Muddy" dark look */}
                <div className="h-48 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/[0.02] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-magic-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <p className="text-[9px] text-white/20 font-mono tracking-[0.5em] animate-pulse relative z-10">
                        WAITING_FOR_DATA_STREAM...
                    </p>
                </div>
            </section>
        </main>
    );
}
//
// function StatCard({ label, value, icon: Icon }: any) {
//     return (
//         <motion.div
//             whileHover={{ y: -5 }}
//             className="glass-brilliant p-8 rounded-3xl group border-white/5 hover:border-magic-purple/30 transition-all duration-500 bg-black/20"
//         >
//             <div className="flex justify-between items-start">
//                 <div className="space-y-2">
//                     <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em] group-hover:text-white/60 transition-colors">
//                         {label}
//                     </p>
//                     <p className="text-4xl font-black text-white tracking-tighter group-hover:sparkle-text transition-all">
//                         {value}
//                     </p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-white/5 text-magic-purple group-hover:bg-magic-purple group-hover:text-white group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-500">
//                     <Icon size={20} />
//                 </div>
//             </div>
//         </motion.div>
//     );
// }