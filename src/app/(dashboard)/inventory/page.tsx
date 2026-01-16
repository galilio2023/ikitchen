'use client';

import React from 'react';
import { Database, Package, Truck, ShieldCheck, Zap } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function InventoryPage() {
    return (
        /* FIXED: Responsive padding p-4 md:p-10 and tighter spacing on mobile */
        <div className="space-y-6 md:space-y-10 p-4 md:p-10 max-w-7xl mx-auto font-mono">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                            <Database size={24} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">
                            Material_DB<span className="text-white/20 not-italic">.bin</span>
                        </h1>
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] ml-0 md:ml-14 text-center md:text-left">
                        Resource_Allocation_Index
                    </p>
                </div>
            </header>

            {/* FIXED: Grid starts as 1 col, moves to 2, then 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: "Surface_Finish", count: 42, icon: Package, color: "text-magic-purple" },
                    { label: "Hardware_Nodes", count: 128, icon: Zap, color: "text-magic-cyan" },
                    { label: "Logistics_Link", count: 12, icon: Truck, color: "text-emerald-400" },
                    { label: "Quality_Shield", count: "100%", icon: ShieldCheck, color: "text-white" },
                ].map(stat => (
                    <div key={stat.label} className="glass-brilliant p-5 md:p-6 rounded-3xl border border-white/10 space-y-4">
                        <div className={`p-2 w-fit rounded-lg bg-white/5 border border-white/10 ${stat.color}`}>
                            <stat.icon size={16} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] text-white/30 uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-xl font-black text-white italic">{stat.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* FIXED: Reduced huge internal padding from p-20 to responsive p-8/p-20 */}
            <div className="glass-brilliant rounded-[1.5rem] md:rounded-[2.5rem] border border-white/20 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-white/10 bg-white/[0.02]">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Stock_Registry</h2>
                </div>
                <div className="py-12 px-6 md:p-20 text-center">
                    <Package size={48} className="mx-auto text-white/5 mb-6" />
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] leading-loose">
                        Inventory_Sync_Required
                    </p>
                    <button className="mt-8 w-full sm:w-auto px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all">
                        Establish_Supply_Link
                    </button>
                </div>
            </div>
        </div>
    );
}