'use client';

import React from 'react';
import { Ruler, Info, Box, Layers, ArrowRight } from 'lucide-react';

export default function MeasurementsPage() {
    return (
        <div className="space-y-10 p-10 max-w-5xl mx-auto font-mono">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-magic-purple/10 border border-magic-purple/20 rounded-2xl text-magic-purple">
                        <Ruler size={24} />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                        Unit_Specs<span className="text-white/20 not-italic">.cfg</span>
                    </h1>
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] ml-14">Standard_Architectural_Units</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="glass-brilliant p-8 rounded-[2.5rem] border border-white/20 space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-white/80 border-b border-white/10 pb-4 flex items-center gap-2">
                        <Box size={16} className="text-magic-purple" />
                        Base_Cabinets
                    </h2>
                    <div className="space-y-4">
                        {[
                            { label: "Standard_Depth", value: "600mm" },
                            { label: "Standard_Height", value: "720mm" },
                            { label: "Kickplate_Height", value: "100mm" },
                        ].map(spec => (
                            <div key={spec.label} className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-[10px] text-white/40 uppercase">{spec.label}</span>
                                <span className="text-[10px] text-white font-black">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass-brilliant p-8 rounded-[2.5rem] border border-white/20 space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-white/80 border-b border-white/10 pb-4 flex items-center gap-2">
                        <Layers size={16} className="text-magic-cyan" />
                        Wall_Cabinets
                    </h2>
                    <div className="space-y-4">
                        {[
                            { label: "Standard_Depth", value: "350mm" },
                            { label: "Standard_Height", value: "720mm" },
                            { label: "Mounting_Clearance", value: "500mm" },
                        ].map(spec => (
                            <div key={spec.label} className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-[10px] text-white/40 uppercase">{spec.label}</span>
                                <span className="text-[10px] text-white font-black">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="glass-brilliant p-8 rounded-[2.5rem] border border-white/20 bg-magic-purple/5">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-magic-purple/20 rounded-lg text-magic-purple">
                        <Info size={16} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Neural_Note</h3>
                        <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider">
                            Global standards are enforced by the Culinary_OS core. Custom overrides can be applied at the individual project level via the Spatial_Registry editor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
