'use client';

import Link from 'next/link';
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

export function SidebarLink({ href, icon, label, active, onClick }: SidebarLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
        >
            <span className={cn(
                "transition-colors",
                active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}>
                {icon}
            </span>
            <span>{label}</span>
        </Link>
    );
}
