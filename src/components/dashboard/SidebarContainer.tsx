'use client';

import React from 'react';
import { LayoutDashboard, ChefHat, Database, Settings, Menu, X, Hexagon } from 'lucide-react';
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
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside className={cn(
                "flex-none flex flex-col h-full z-50 border-r bg-card",
                "fixed inset-y-0 left-0 w-72 transition-transform duration-300 md:relative md:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
                            <Hexagon size={20} fill="currentColor" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Kitchen<span className="text-primary">Voyager</span>
                        </span>
                    </div>
                    <button onClick={closeSidebar} className="md:hidden p-2 hover:bg-accent rounded-md text-muted-foreground">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                    <nav className="space-y-6">
                        <SidebarGroup title="Platform">
                            <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === "/dashboard"} onClick={closeSidebar} />
                            <SidebarLink href="/projects" icon={<ChefHat size={18} />} label="Projects" active={pathname === "/projects"} onClick={closeSidebar} />
                        </SidebarGroup>

                        <SidebarGroup title="Configuration">
                            <SidebarLink href="/inventory" icon={<Database size={18} />} label="Inventory" active={pathname === "/inventory"} onClick={closeSidebar} />
                            <SidebarLink href="/settings" icon={<Settings size={18} />} label="Settings" active={pathname === "/settings"} onClick={closeSidebar} />
                        </SidebarGroup>
                    </nav>
                </div>
                
                <div className="p-4 border-t border-border/40">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Admin User</p>
                            <p className="text-xs text-muted-foreground truncate">admin@voyager.sys</p>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full min-w-0 bg-muted/10">
                <header className="h-16 flex-none flex items-center justify-between px-6 border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 -ml-2 hover:bg-accent rounded-md text-muted-foreground"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <h1 
                            className="text-lg font-semibold text-foreground capitalize"
                            suppressHydrationWarning
                        >
                            {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <CreateProjectButton size="sm" />
                        <div className="h-6 w-px bg-border/50 mx-1" />
                        <ThemeToggle />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
});

SidebarContainer.displayName = 'SidebarContainer';
