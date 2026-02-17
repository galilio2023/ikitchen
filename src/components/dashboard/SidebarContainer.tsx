'use client';

import React from 'react';
import { LayoutDashboard, ChefHat, Database, Settings, Plus, X, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store/uiStore";
import { SidebarGroup } from './SidebarGroup';
import { SidebarLink } from './SidebarLink';
import { ThemeToggle } from '../ThemeToggle';
import CreateProjectButton from '../CreateProjectButton';

export const SidebarContainer = React.memo(({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { openModal } = useUIStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const closeSidebar = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex h-screen w-full bg-background text-foreground">

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside className={cn(
                "flex-none flex flex-col h-full z-50 border-r bg-card text-card-foreground",
                "fixed inset-y-0 left-0 w-64 transition-transform duration-300 md:relative md:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex justify-between items-center border-b">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">
                            KITCHEN_VOYAGER
                        </h2>
                    </div>
                    <button onClick={closeSidebar} className="md:hidden btn btn-ghost text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-4">
                    <SidebarGroup title="Menu">
                        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === "/dashboard"} onClick={closeSidebar} />
                        <SidebarLink href="/projects" icon={<ChefHat size={18} />} label="Projects" active={pathname === "/projects"} onClick={closeSidebar} />
                    </SidebarGroup>
                    
                    <CreateProjectButton 
                        className="w-full" 
                        onClick={closeSidebar}
                    />

                    <SidebarGroup title="Configuration">
                        <SidebarLink href="/inventory" icon={<Database size={18} />} label="Inventory" active={pathname === "/inventory"} onClick={closeSidebar} />
                        <SidebarLink href="/settings" icon={<Settings size={18} />} label="Settings" active={pathname === "/settings"} onClick={closeSidebar} />
                    </SidebarGroup>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col h-full min-w-0 bg-background text-foreground">
                <header className="h-16 flex-none flex items-center justify-between px-6 border-b bg-background text-foreground">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden btn btn-ghost -ml-2 text-foreground"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 
                            className="text-lg font-semibold text-foreground capitalize"
                            suppressHydrationWarning
                        >
                            {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {/* Mobile-only create button in header */}
                        <CreateProjectButton className="md:hidden" size="icon" label="" />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-background text-foreground">
                    {children}
                </main>
            </div>
        </div>
    );
});

SidebarContainer.displayName = 'SidebarContainer';
