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
                "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-foreground",
                active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
