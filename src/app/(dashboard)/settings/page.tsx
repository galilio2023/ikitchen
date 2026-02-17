"use client";

import React from "react";
import { Settings, User, Cpu, Database, Save, RotateCcw, Moon, Sun, Bell, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/40">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm">
              <Settings size={28} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              System Settings
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl">
            Manage your account preferences, system configurations, and notifications.
          </p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
                <RotateCcw size={16} />
                Reset
            </Button>
            <Button className="gap-2">
                <Save size={16} />
                Save Changes
            </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation/Summary */}
        <div className="space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        AD
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Admin User</h3>
                        <p className="text-xs text-muted-foreground">admin@voyager.sys</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 text-primary font-medium text-sm">
                        <User size={16} /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground font-medium text-sm transition-colors">
                        <Cpu size={16} /> System
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground font-medium text-sm transition-colors">
                        <Bell size={16} /> Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground font-medium text-sm transition-colors">
                        <Shield size={16} /> Security
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
                <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <Database size={16} />
                    System Status
                </h4>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Database</span>
                        <span className="text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="text-foreground font-medium">24ms</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage</span>
                        <span className="text-foreground font-medium">1.2GB / 5.0GB</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 h-1.5 rounded-full overflow-hidden mt-2">
                        <div className="bg-blue-500 h-full w-[24%]" />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <section className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                    <div className="p-2 bg-muted rounded-lg">
                        <User size={20} className="text-foreground" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Profile Settings</h2>
                        <p className="text-sm text-muted-foreground">Update your personal information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Display Name</label>
                        <input
                            type="text"
                            defaultValue="Admin User"
                            className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email Address</label>
                        <input
                            type="email"
                            defaultValue="admin@voyager.sys"
                            className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-sm font-medium text-foreground">Bio</label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>
            </section>

            {/* Preferences Section */}
            <section className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                    <div className="p-2 bg-muted rounded-lg">
                        <Cpu size={20} className="text-foreground" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Preferences</h2>
                        <p className="text-sm text-muted-foreground">Customize your workspace experience</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-foreground">Appearance</p>
                            <p className="text-xs text-muted-foreground">Toggle between light and dark mode</p>
                        </div>
                        <ThemeToggleButton />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-foreground">Real-time Sync</p>
                            <p className="text-xs text-muted-foreground">Automatically save changes as you work</p>
                        </div>
                        <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-foreground">Desktop Notifications</p>
                            <p className="text-xs text-muted-foreground">Receive alerts for project updates</p>
                        </div>
                        <div className="h-6 w-11 bg-muted rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
