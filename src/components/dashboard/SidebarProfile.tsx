'use client';

import React from 'react';
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import gsap from "gsap";

export function SidebarProfile() {
    const { data: session } = useSession();

    const handleSignOut = () => {
        const tl = gsap.timeline();
        
        tl.to("body", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                signOut();
            }
        });
    };

    return (
        <div className="p-6 mt-auto border-t border-border space-y-4">
            <div className="glass-brilliant p-4 rounded-2xl flex items-center gap-3 border border-border">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-[10px] font-black text-magic-cyan uppercase">
                    {session?.user?.name?.slice(0, 2) || "IG"}
                </div>
                <div className="text-[10px] overflow-hidden">
                    <p className="text-foreground font-black uppercase tracking-tight truncate">{session?.user?.name || "Commander Admin"}</p>
                    <p className="text-foreground/40 text-[8px] uppercase tracking-widest mt-0.5 truncate">{session?.user?.email || "admin@voyager.os"}</p>
                </div>
            </div>

            <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-accent/20 border border-border text-foreground/40 hover:text-red-400 hover:border-red-400/40 hover:bg-red-400/5 transition-all duration-300 text-[10px] font-black uppercase tracking-widest group"
            >
                <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                Sign_Out
            </button>
        </div>
    );
}
