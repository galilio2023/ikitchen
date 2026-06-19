'use client';

import React from 'react';
import { LayoutDashboard, ChefHat, Database, Settings, Menu, X, Hexagon, Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store/uiStore";
import { SidebarGroup } from './SidebarGroup';
import { SidebarLink } from './SidebarLink';
import { ThemeToggle } from '../ThemeToggle';
import CreateProjectButton from '../CreateProjectButton';

export const SidebarContainer = React.memo(({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { openModal, language, setLanguage } = useUIStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const closeSidebar = () => setIsMobileMenuOpen(false);
    const isAr = language === 'ar';

    return (
        <div 
            className="flex h-screen w-full bg-background text-foreground"
            dir={isAr ? 'rtl' : 'ltr'}
        >

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside className={cn(
                "flex-none flex flex-col h-full z-50 bg-card",
                "fixed inset-y-0 w-72 transition-transform duration-300 md:relative md:translate-x-0",
                isAr ? "right-0 border-l border-border/40" : "left-0 border-r border-border/40",
                isMobileMenuOpen ? "translate-x-0" : (isAr ? "translate-x-full" : "-translate-x-full")
            )}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
                            <Hexagon size={20} fill="currentColor" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            iKitchen<span className="text-primary">.ai</span>
                        </span>
                    </div>
                    <button onClick={closeSidebar} className="md:hidden p-2 hover:bg-accent rounded-md text-muted-foreground cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div 
                    className={cn("flex-1 overflow-y-auto py-6 px-4 space-y-6", isAr ? "text-right" : "text-left")}
                    dir={isAr ? "rtl" : "ltr"}
                >
                    <nav className="space-y-6">
                        <SidebarGroup title={isAr ? "المنصة الرئيسية" : "Platform Hub"}>
                            <SidebarLink 
                                href="/dashboard" 
                                icon={<LayoutDashboard size={18} />} 
                                label={isAr ? "لوحة تحكم المعرض" : "Showroom Dashboard"} 
                                active={pathname === "/dashboard"} 
                                onClick={closeSidebar} 
                            />
                            <SidebarLink 
                                href="/projects" 
                                icon={<ChefHat size={18} />} 
                                label={isAr ? "خزينة المشاريع والتصاميم" : "Projects Vault"} 
                                active={pathname === "/projects"} 
                                onClick={closeSidebar} 
                            />
                        </SidebarGroup>

                        <SidebarGroup title={isAr ? "إعدادات النظام" : "Configuration"}>
                            <SidebarLink 
                                href="/settings" 
                                icon={<Settings size={18} />} 
                                label={isAr ? "خيارات التهيئة والأسعار" : "Material Pricing"} 
                                active={pathname === "/settings"} 
                                onClick={closeSidebar} 
                            />
                        </SidebarGroup>
                    </nav>
                </div>
                
                <div className="p-4 border-t border-border/40" dir={isAr ? "rtl" : "ltr"}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            IK
                        </div>
                        <div className={cn("flex-1 min-w-0", isAr ? "text-right" : "text-left")}>
                            <p className="text-sm font-bold truncate">
                                {isAr ? "مدير المعرض" : "Showroom Manager"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate font-mono">admin@ikitchen.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full min-w-0 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
                <header className="h-16 flex-none flex items-center justify-between px-4 md:px-6 border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-2 md:gap-4 min-w-0">
                        <button
                            className={cn("md:hidden p-2 hover:bg-accent rounded-md text-muted-foreground shrink-0 cursor-pointer", isAr ? "-mr-2" : "-ml-2")}
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <h1 
                            className="text-sm md:text-lg font-extrabold text-foreground truncate"
                            suppressHydrationWarning
                        >
                            {(() => {
                                const segments = pathname.split('/');
                                const mainSegment = segments[1] || 'dashboard';
                                
                                const ROUTE_NAMES_AR: Record<string, string> = {
                                    'dashboard': 'لوحة التحكم والمبيعات (CRM)',
                                    'projects': 'خزينة المشاريع والتصاميم (Vault)',
                                    'settings': 'خيارات التهيئة والأسعار (Settings)',
                                    'editor': 'محرر ومصمم المطابخ (Editor)'
                                };
                                const ROUTE_NAMES_EN: Record<string, string> = {
                                    'dashboard': 'CRM Showroom Dashboard',
                                    'projects': 'Projects Vault',
                                    'settings': 'Material Pricing Settings',
                                    'editor': 'Smart Kitchen Configurator'
                                };
                                return isAr ? (ROUTE_NAMES_AR[mainSegment] || 'iKitchen.ai') : (ROUTE_NAMES_EN[mainSegment] || 'iKitchen.ai');
                            })()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        {/* New Project Button */}
                        <CreateProjectButton 
                            size="sm" 
                            className="h-8 md:h-9 px-2 md:px-4 cursor-pointer text-xs font-bold"
                            hideLabelOnMobile={true}
                            label={isAr ? "تصميم جديد" : "New Design"}
                        />
                        <div className="h-6 w-px bg-border/50 mx-0.5 md:mx-1" />
                        
                        {/* Language Selector Button */}
                        <button
                            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
                            className="h-8 md:h-9 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground transition-all border border-border bg-card hover:bg-accent cursor-pointer text-xs font-extrabold shadow-sm relative group"
                            title={isAr ? "Switch to English" : "تغيير لغة النظام إلى العربية"}
                        >
                            <Globe size={13} className="text-primary animate-pulse" />
                            <span>{isAr ? 'English' : 'عربي'}</span>
                            <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                        </button>

                        <div className="h-6 w-px bg-border/50 mx-0.5 md:mx-1" />
                        <ThemeToggle />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
});

SidebarContainer.displayName = 'SidebarContainer';
