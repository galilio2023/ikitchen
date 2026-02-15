"use client";

import React from "react";
import {
  Settings,
  User,
  Cpu,
  Database,
  Save,
  RotateCcw,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { CyberButton } from "@/components/settings/CyberButton";

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-12 w-12" />;
  }

  const isDark = theme === "dark";

  return (
    <CyberButton
      variant="icon"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Theme"
    >
      <div className="relative h-6 w-6 flex items-center justify-center">
        <Sun
          size={18}
          className={`absolute transition-all duration-500 ${isDark ? "transform rotate-0 scale-100 opacity-100" : "transform -rotate-90 scale-0 opacity-0"}`}
        />
        <Moon
          size={18}
          className={`absolute transition-all duration-500 ${!isDark ? "transform rotate-0 scale-100 opacity-100" : "transform rotate-90 scale-0 opacity-0"}`}
        />
      </div>
    </CyberButton>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 md:space-y-10 p-4 md:p-10 max-w-5xl mx-auto font-mono">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-magic-purple/10 border border-magic-purple/20 rounded-2xl text-magic-purple">
            <Settings size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground italic">
            System_Config
            <span className="text-foreground/20 not-italic">.yaml</span>
          </h1>
        </div>
        <p className="text-[10px] text-foreground/40 uppercase tracking-[0.4em] ml-0 md:ml-14">
          Core_Operational_Parameters
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <section className="glass-brilliant p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-border space-y-6">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <User size={18} className="text-magic-purple" />
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">
              User_Profile
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[8px] text-foreground/30 uppercase tracking-[0.2em]">
                Registry_Alias
              </label>
              <input
                type="text"
                defaultValue="ADMIN_USER_01"
                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-[10px] text-foreground focus:outline-none focus:border-magic-purple/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] text-foreground/30 uppercase tracking-[0.2em]">
                Neural_Link_ID
              </label>
              <input
                type="text"
                defaultValue="admin@voyager.sys"
                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-3 text-[10px] text-foreground focus:outline-none focus:border-magic-purple/40"
              />
            </div>
          </div>
        </section>

        {/* System Preferences */}
        <section className="glass-brilliant p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-border space-y-6">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <Cpu size={18} className="text-magic-cyan" />
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">
              System_Preferences
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] text-foreground font-bold uppercase">
                  Dark_Mode_Overlay
                </p>
                <p className="text-[8px] text-foreground/30 uppercase leading-relaxed">
                  System visual state
                </p>
              </div>
              <ThemeToggleButton />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] text-foreground font-bold uppercase">
                  Auto_Sync_Realtime
                </p>
                <p className="text-[8px] text-foreground/30 uppercase leading-relaxed">
                  Push changes immediately
                </p>
              </div>
              <div className="h-4 w-8 bg-foreground/10 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 h-2 w-2 bg-magic-cyan rounded-full shadow-[0_0_8px_#06b6d4]" />
              </div>
            </div>
          </div>
        </section>

        {/* Database Info */}
        <section className="glass-brilliant p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-border space-y-6 md:col-span-2">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <Database size={18} className="text-emerald-400" />
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground/80">
              Registry_Database
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="p-4 bg-accent/30 border border-border rounded-2xl space-y-1">
              <p className="text-[7px] text-foreground/30 uppercase tracking-[0.3em]">
                Connection_Status
              </p>
              <p className="text-[10px] text-emerald-400 font-black uppercase">
                Established
              </p>
            </div>
            <div className="p-4 bg-accent/30 border border-border rounded-2xl space-y-1">
              <p className="text-[7px] text-foreground/30 uppercase tracking-[0.3em]">
                Latency
              </p>
              <p className="text-[10px] text-foreground font-black uppercase">
                24ms
              </p>
            </div>
            <div className="p-4 bg-accent/30 border border-border rounded-2xl space-y-1">
              <p className="text-[7px] text-foreground/30 uppercase tracking-[0.3em]">
                Storage_Used
              </p>
              <p className="text-[10px] text-foreground font-black uppercase">
                1.2GB / 5.0GB
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="flex flex-col sm:flex-row justify-end gap-4 pt-6 md:pt-10 border-t border-border">
        <CyberButton variant="outline" icon={<RotateCcw size={14} />}>
          Reset_to_Defaults
        </CyberButton>
        <CyberButton variant="outline" icon={<Save size={14} />}>
          Commit_Changes
        </CyberButton>
      </footer>
    </div>
  );
}
