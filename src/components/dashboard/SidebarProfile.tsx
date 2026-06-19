'use client';

import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";

export function SidebarProfile() {
    const { data: session } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = '/login';
                }
            }
        });
    };

    if (!session) {
        return null;
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-bold text-muted-foreground">
                        {session.user?.name?.[0].toUpperCase()}
                    </span>
                </div>
                <div>
                    <p className="text-sm font-semibold">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                </div>
            </div>
            <button onClick={handleSignOut} className="btn btn-ghost">
                <LogOut size={18} />
            </button>
        </div>
    );
}
