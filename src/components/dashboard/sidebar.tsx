'use client';

import React from 'react';
import { LayoutDashboard, ChefHat, Ruler, Database, Settings, Search, Bell, Command } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CreateProjectModal from '../CreateProjectModal';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-full bg-black text-white antialiased overflow-hidden font-mono relative isolate">

            {/* --- COMPONENT 1: GLOBAL BACKGROUND NODES --- */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-magic-purple/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] bg-magic-cyan/5 blur-[100px] rounded-full opacity-30" />
            </div>

            {/* --- COMPONENT 2: THE SIDEBAR --- */}
            <aside className="w-64 flex flex-col h-full relative z-[60] border-r border-white/5 bg-black/40 backdrop-blur-3xl rounded-r-[2.5rem] shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                {/* Logo Section */}
                <div className="p-10">
                    <h2 className="text-2xl font-black tracking-tighter text-white italic">
                        KITCHEN<span className="text-white/20 not-italic">_VOYAGER</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="h-1 w-1 rounded-full bg-magic-purple shadow-[0_0_8px_#8b5cf6] animate-pulse" />
                        <p className="text-[8px] text-white/40 uppercase tracking-[0.5em]">Culinary_OS_v4.1</p>
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 px-4 space-y-8 overflow-y-auto scrollbar-hide">
                    <SidebarGroup title="Production_Control">
                        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" active={pathname === "/dashboard"} />
                        <SidebarLink href="/projects" icon={<ChefHat size={18} />} label="Project_Vault" active={pathname === "/projects"} />
                        <SidebarLink href="/measurements" icon={<Ruler size={18} />} label="Unit_Specs" active={pathname === "/measurements"} />
                    </SidebarGroup>

                    <SidebarGroup title="Resource_Node">
                        <SidebarLink href="/inventory" icon={<Database size={18} />} label="Material_DB" active={pathname === "/inventory"} />
                        <SidebarLink href="/settings" icon={<Settings size={18} />} label="System_Config" active={pathname === "/settings"} />
                    </SidebarGroup>
                </nav>

                {/* Footer / User Section */}
                <div className="p-6 mt-auto border-t border-white/5">
                    <div className="glass-brilliant p-4 rounded-2xl flex items-center gap-3 border border-white/5 group cursor-pointer transition-all hover:bg-white/[0.05]">
                        <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[10px] font-black text-magic-purple">IG</div>
                        <div className="text-[10px]">
                            <p className="text-white font-black uppercase tracking-tight">I. Galal</p>
                            <p className="text-white/40 text-[8px] uppercase tracking-widest mt-0.5">Head_Operator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- COMPONENT 3: MAIN VIEWPORT CONTAINER --- */}
            <div className="flex-1 flex flex-col h-full relative min-w-0">

                {/* --- COMPONENT 4: THE NAVBAR/HEADER --- */}
                <header className="h-24 flex-none flex items-center justify-between px-10 relative z-[50] border-b border-white/[0.03] bg-black/20 backdrop-blur-md">
                    <div className="relative group max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-magic-purple transition-colors" />
                        <input
                            placeholder="SEARCH_KITCHENS_OR_SPECS..."
                            className="w-full h-12 pl-12 pr-4 rounded-2xl text-[10px] tracking-[0.2em] uppercase text-white bg-white/[0.03] border border-white/5 focus:outline-none focus:border-magic-purple/40 focus:bg-white/[0.06] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="h-12 w-12 rounded-2xl flex items-center justify-center text-white/40 hover:text-magic-purple transition-all border border-white/5 hover:bg-white/5 relative">
                            <Bell size={18} />
                            <span className="absolute top-3 right-3 h-1.5 w-1.5 bg-magic-purple rounded-full shadow-[0_0_10px_#8b5cf6]" />
                        </button>
                        <div className="h-6 w-[1px] bg-white/10 mx-2" />
                        <CreateProjectModal />
                    </div>
                </header>

                {/* --- COMPONENT 5: DYNAMIC CONTENT AREA --- */}
                <main className="flex-1 overflow-y-auto px-10 pb-10 relative will-change-transform isolate">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 left-1/4 w-[50vw] h-[40vh] bg-magic-purple/[0.03] blur-[120px] pointer-events-none -z-10" />

                    <div className="max-w-[1600px] mx-auto pt-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

{/* --- HELPER SUB-COMPONENTS (Kept internal for organization) --- */}

function SidebarGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section>
            <p className="px-4 text-[9px] uppercase tracking-[0.5em] text-white/30 font-black mb-5">
                {title}
            </p>
            <div className="space-y-1">{children}</div>
        </section>
    );
}

function SidebarLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
    return (
        <Link
            href={href}
            className={`group flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] transition-all duration-500 relative overflow-hidden font-bold uppercase tracking-widest ${
                active
                    ? "text-white bg-white/[0.05] border border-white/10"
                    : "text-white/40 hover:text-white hover:bg-white/[0.02]"
            }`}
        >
            {active && <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-magic-purple rounded-r-full shadow-[0_0_15px_#8b5cf6]" />}
            <span className={`${active ? "text-magic-purple scale-110" : "group-hover:text-magic-purple group-hover:scale-110"} transition-all duration-500`}>
                {icon}
            </span>
            <span className={active ? "translate-x-1" : "group-hover:translate-x-1 transition-all"}>
                {label}
            </span>
        </Link>
    );
}