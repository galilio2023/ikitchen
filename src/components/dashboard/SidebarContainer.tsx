'use client';

import React from 'react';
import { LayoutDashboard, ChefHat, Ruler, Database, Settings, Search, Bell, Plus, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';
import { useAppDispatch } from "@/lib/hooks";
import { openModal } from "@/lib/features/ui/uiSlice";
import { SidebarGroup } from './SidebarGroup';
import { SidebarLink } from './SidebarLink';
import { SidebarProfile } from './SidebarProfile';
import { AICommandInput } from './AICommandInput';
import { ThemeToggle } from '../ThemeToggle';

const CreateProjectModal = dynamic(() => import('../CreateProjectModal'), {
    ssr: false,
    loading: () => <div className="h-10 w-24 animate-pulse bg-white/5 rounded-xl" />
});

export const SidebarContainer = React.memo(({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const isEditor = pathname.includes('/projects/') && pathname.split('/').length >= 3;

    // Close sidebar when clicking a link on mobile
    const closeSidebar = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex h-dvh w-full text-foreground antialiased overflow-hidden font-mono relative bg-transparent">

            {/* --- MOBILE OVERLAY --- */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            {/* --- SIDEBAR --- */}
            <aside className={cn(
                "flex-none flex flex-col h-full relative z-[60] border-r border-border bg-card/20 backdrop-blur-xl transition-transform duration-300 shadow-[10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[10px_0_30px_rgba(0,0,0,0.5)]",
                "fixed inset-y-0 left-0 w-72 rounded-r-[2.5rem] md:relative md:w-64 md:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Branding & Close Button */}
                <div className="p-6 md:p-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black tracking-tighter text-foreground italic">
                            KITCHEN<span className="text-foreground/40 not-italic">_VOYAGER</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="h-1 w-1 rounded-full bg-magic-purple shadow-[0_0_8px_#8b5cf6] animate-pulse" />
                            <p className="text-[8px] text-foreground/50 uppercase tracking-[0.5em]">Culinary_OS_v4.1</p>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={closeSidebar} className="md:hidden p-2 text-foreground/40 hover:text-magic-purple">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-6 md:space-y-8 overflow-y-auto scrollbar-hide">
                    <SidebarGroup title="Production_Control">
                        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" active={pathname === "/dashboard"} onClick={closeSidebar} />
                        <SidebarLink href="/projects" icon={<ChefHat size={18} />} label="Project_Vault" active={pathname === "/projects"} onClick={closeSidebar} />
                        <SidebarLink href="/measurements" icon={<Ruler size={18} />} label="Unit_Specs" active={pathname === "/measurements"} onClick={closeSidebar} />

                        <button
                            onClick={() => { dispatch(openModal()); closeSidebar(); }}
                            className="w-full group flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] text-foreground/60 hover:text-foreground hover:bg-accent/50 transition-all duration-300 font-bold uppercase tracking-widest cursor-pointer"
                        >
                            <span className="transition-transform duration-300 group-hover:text-magic-purple group-hover:scale-110">
                                <Plus size={18} />
                            </span>
                            <span className="transition-all group-hover:translate-x-1">Add_Kitchen</span>
                        </button>
                    </SidebarGroup>

                    <SidebarGroup title="Resource_Node">
                        <SidebarLink href="/inventory" icon={<Database size={18} />} label="Material_DB" active={pathname === "/inventory"} onClick={closeSidebar} />
                        <SidebarLink href="/settings" icon={<Settings size={18} />} label="System_Config" active={pathname === "/settings"} onClick={closeSidebar} />
                    </SidebarGroup>

                    <AICommandInput />
                </nav>

                <SidebarProfile />
            </aside>

            {/* --- MAIN VIEWPORT --- */}
            <div className="flex-1 flex flex-col h-full relative min-w-0">
                {/* Responsive Header */}
                <header className="h-20 md:h-24 flex-none flex items-center justify-between px-6 md:px-10 relative z-[50] border-b border-border bg-background/20 backdrop-blur-md">
                    <div className="flex items-center gap-4 max-w-md w-full">
                        {/* Mobile Menu Trigger */}
                        <button
                            className="md:hidden p-2 -ml-2 text-foreground/60 hover:text-magic-purple transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <LayoutDashboard size={24} />
                        </button>

                        {/* Search - Hidden on tiny screens to save space */}
                        <div className="relative group flex-1 hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40 group-focus-within:text-magic-purple transition-colors" />
                            <input
                                placeholder="SEARCH_NODES..."
                                className="w-full h-11 md:h-12 pl-12 pr-4 rounded-2xl text-[10px] tracking-[0.2em] uppercase text-foreground bg-accent/50 border border-border placeholder:text-muted-foreground focus:outline-none focus:border-magic-purple/40 focus:bg-accent/80 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <button className="hidden xs:flex h-10 w-10 rounded-2xl items-center justify-center text-foreground/60 hover:text-magic-purple transition-all border border-border hover:bg-accent relative">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-magic-purple rounded-full shadow-[0_0_10px_#8b5cf6]" />
                        </button>
                        <div className="hidden xs:block h-6 w-[1px] bg-border mx-2" />
                        <CreateProjectModal />
                    </div>
                </header>

                <main className="flex-1 overflow-hidden relative">
                    <div className={cn(
                        "h-full relative z-10 transition-all duration-500",
                        isEditor
                            ? "w-full max-w-none"
                            : "max-w-[1600px] mx-auto px-4 md:px-10 pt-6 md:pt-8 overflow-y-auto pb-10 scrollbar-hide"
                    )}>
                        {children}
                    </div>
                    {/* Desktop-only shadow overlay */}
                    <div className="hidden md:block absolute inset-y-0 left-0 w-20 pointer-events-none bg-gradient-to-r dark:from-black/40 from-black/5 to-transparent z-20" />
                </main>
            </div>
        </div>
    );
});

SidebarContainer.displayName = 'SidebarContainer';