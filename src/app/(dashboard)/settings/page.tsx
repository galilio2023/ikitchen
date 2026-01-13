'use client';

import React from 'react';
import { Settings, Shield, Bell, User, Cpu, Database, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-10 p-10 max-w-5xl mx-auto font-mono">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-magic-purple/10 border border-magic-purple/20 rounded-2xl text-magic-purple">
                        <Settings size={24} />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                        System_Config<span className="text-white/20 not-italic">.yaml</span>
                    </h1>
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] ml-14">Core_Operational_Parameters</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Section */}
                <section className="glass-brilliant p-8 rounded-[2.5rem] border border-white/20 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <User size={18} className="text-magic-purple" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-white/80">User_Profile</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[8px] text-white/30 uppercase tracking-[0.2em]">Registry_Alias</label>
                            <input 
                                type="text" 
                                defaultValue="ADMIN_USER_01"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-magic-purple/40"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] text-white/30 uppercase tracking-[0.2em]">Neural_Link_ID</label>
                            <input 
                                type="text" 
                                defaultValue="admin@voyager.sys"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-magic-purple/40"
                            />
                        </div>
                    </div>
                </section>

                {/* System Preferences */}
                <section className="glass-brilliant p-8 rounded-[2.5rem] border border-white/20 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <Cpu size={18} className="text-magic-cyan" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-white/80">System_Preferences</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[10px] text-white font-bold uppercase">Dark_Mode_Overlay</p>
                                <p className="text-[8px] text-white/30 uppercase">Always active for power saving</p>
                            </div>
                            <div className="h-4 w-8 bg-magic-purple rounded-full relative">
                                <div className="absolute right-1 top-1 h-2 w-2 bg-white rounded-full" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[10px] text-white font-bold uppercase">Auto_Sync_Realtime</p>
                                <p className="text-[8px] text-white/30 uppercase">Push changes immediately</p>
                            </div>
                            <div className="h-4 w-8 bg-white/10 rounded-full relative">
                                <div className="absolute left-1 top-1 h-2 w-2 bg-white/20 rounded-full" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Database Info */}
                <section className="glass-brilliant p-8 rounded-[2.5rem] border border-white/20 space-y-6 md:col-span-2">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <Database size={18} className="text-emerald-400" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-white/80">Registry_Database</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-1">
                            <p className="text-[7px] text-white/30 uppercase tracking-[0.3em]">Connection_Status</p>
                            <p className="text-[10px] text-emerald-400 font-black uppercase">Established</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-1">
                            <p className="text-[7px] text-white/30 uppercase tracking-[0.3em]">Latency</p>
                            <p className="text-[10px] text-white font-black uppercase">24ms</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-1">
                            <p className="text-[7px] text-white/30 uppercase tracking-[0.3em]">Storage_Used</p>
                            <p className="text-[10px] text-white font-black uppercase">1.2GB / 5.0GB</p>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="flex justify-end gap-4 pt-10 border-t border-white/10">
                <button className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
                    Reset_to_Defaults
                </button>
                <button className="flex items-center gap-2 px-8 py-3 bg-magic-purple rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-all">
                    <Save size={14} />
                    Commit_Changes
                </button>
            </footer>
        </div>
    );
}
